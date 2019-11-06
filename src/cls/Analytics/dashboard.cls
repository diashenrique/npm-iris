Class Analytics.dashboard Extends %CSP.Page
{

Parameter CHARSET = "utf-8";

ClassMethod OnPage() As %Status
{
	#dim %request As %CSP.Request
	#dim %response As %CSP.Response
	
	Set Method 	= $Get(%request.Data("method",1))

	xecute "do .."_Method_"()"
	
	Quit $$$OK
}

ClassMethod getMetrics() As %Status
{
	
	do ##class(VAR.infra.SystemDashboard).getDashboardSample(.dashboard)
	do ##class(VAR.infra.SystemDashboard).getClassProperties(dashboard.%ClassName(1), .propList, .descrList)
	
	set arrayMetrics = []
	set jsonMetrics  = {}
	
	for i=1:1:$listlength(propList) {
		set descr = $listget(descrList,i)
		set propertyName = $listget(propList,i)
		set propertyValue = $property(dashboard, propertyName)
		
		do jsonMetrics.%Set(propertyName, propertyValue)
		
	}
	
	write $replace($replace(jsonMetrics.%ToJSON(),"""'",""),"'""","")
	
	quit $$$OK
}

}
