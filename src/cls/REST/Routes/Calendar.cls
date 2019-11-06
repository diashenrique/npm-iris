Class REST.Routes.Calendar Extends %CSP.REST
{

ClassMethod List() As %Status
{
	set %response.ContentType = "application/json"
	
	set tSC = $System.Status.OK()
	set arrayUser = []
	set dynamicUser = {}

    try {

		set oRS = ##class(%SQL.Statement).%New()
        
        ;set tSC = oRS.%PrepareClassQuery("%SYS.ProcessQuery", "CONTROLPANEL")
        set sql = "SELECT ID,UserName,Name,email,%External(DateOfBirth) as DateOfBirth,JobTitle,Company,ProfileHeading,PhotoProfile,Active,Password FROM SQLUser.Person"
        
        set tSC = oRS.%Prepare(sql)
       
        quit:$System.Status.IsError(tSC)
        
        set intcolumnCount = oRS.%Metadata.columnCount
        
        set result = oRS.%Execute()
        
        if (result.%SQLCODE '< 0) {
	        while result.%Next() {
	        	set json = {}
	        	for i=1:1:intcolumnCount {
					do json.%Set(oRS.%Metadata.columns.GetAt(i).colName,result.%GetData(i))
				}
				do arrayUser.%Push(json)
            }
        } else {
            throw ##class(%Exception.SQL).CreateFromSQLCODE(result.%SQLCODE,result.%Message)
        }
	    
	    
    } catch (oException) {
        set tSC = oException.AsStatus()
    }
    
    do dynamicUser.%Set("data",arrayUser)
    
    write dynamicUser.%ToJSON() 
    
    quit tSC
}

ClassMethod Update(id As %Integer) As %Status
{
	set obj = ##class(%DynamicObject).%FromJSON(%request.Content)
	
	set objUser = ##class(User.Person).%OpenId(id)
	
	If '$IsObject(objUser) {
		set %response.Status = ..#HTTP404NOTFOUND
		quit $$$OK
	}
	
	set iter = obj.%GetIterator()
	while iter.%GetNext(.key , .value )  {
		if (key = "DateOfBirth") {
			set $property(objUser, key) = $zdateh($replace(value,"/",""),8)
		} else {
			set $property(objUser, key) = value
		}
	}
	
	set tSC = objUser.%Save()
	
	if $$$ISERR(tSC) {
		quit $System.OBJ.DisplayError(tSC)
	}
		
	quit $$$OK
}

ClassMethod Delete(id As %Integer) As %Status
{
	if '##class(User.Person).%ExistsId(id) {
		set %responde.Status = "404 AQUI"
		quit $$$OK	
	}
	
	do ##class(User.Person).%DeleteId(id)
	
	quit $$$OK
}

ClassMethod NewCalendar() As %Status
{
	set obj = {}.%FromJSON(%request.Content)
	
	set user = ##class(User.Person).%New()
	
	set user.UserName = obj.UserName
	set user.Name = obj.Name
	set user.email = obj.email
	set user.DateOfBirth = $zdateh($replace(obj.DateOfBirth,"/",""),8)
	set user.JobTitle = obj.JobTitle
	set user.Company = obj.Company
	set user.ProfileHeading = obj.ProfileHeading
	set user.Active = obj.Active
	
	set tSC = user.%Save()
	
	quit tSC
}

ClassMethod GetCalendar(id As %Integer) As %Status
{
	
	set %response.ContentType = "application/json"
	
	set user = ##class(User.Person).%OpenId(id)
	set obj = {}
	
	do obj.%Set("id", user.%Id())
	do obj.%Set("UserName", user.UserName)
	do obj.%Set("Name", user.Name)
	do obj.%Set("email", user.email)
	do obj.%Set("DateOfBirth", user.DateOfBirth)
	do obj.%Set("JobTitle", user.JobTitle)
	do obj.%Set("Company", user.Company)
	do obj.%Set("ProfileHeading", user.ProfileHeading)
	do obj.%Set("Active", user.Active)
	
	write obj.%ToJSON()
	
	quit $$$OK
}

}
