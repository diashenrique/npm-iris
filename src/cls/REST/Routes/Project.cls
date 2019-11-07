Class REST.Routes.Project Extends %CSP.REST
{

ClassMethod List() As %Status
{
	set %response.ContentType = "application/json"

	set tSC = $system.Status.OK()
	set arrayUser = []
	set dynamicUser = {}

    try {

		set oRS = ##class(%SQL.Statement).%New()

        set sql = "SELECT ID, Code, Description, Status, %External(BeginDate) As BeginDate, %External(EndDate) As EndDate, Remarks FROM SQLUser.Project"

        set tSC = oRS.%Prepare(sql)

        quit:$system.Status.IsError(tSC)

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
        }
        else {
            throw ##class(%Exception.SQL).CreateFromSQLCODE(result.%SQLCODE,result.%Message)
        }


    }
    catch (oException) {
        set tSC = oException.AsStatus()
    }

    do dynamicUser.%Set("data",arrayUser)

    write dynamicUser.%ToJSON() 

    quit tSC
}

ClassMethod Update(id As %Integer) As %Status
{
	set obj = ##class(%DynamicObject).%FromJSON(%request.Content)

	set objProject = ##class(User.Project).%OpenId(id)

	if '$isobject(objProject) {
		set %response.Status = ..#HTTP404NOTFOUND
		quit $$$OK
	}

	set iter = obj.%GetIterator()
	while iter.%GetNext(.key , .value )  {
		if ((key = "BeginDate") || (key = "EndDate")) {
			set $property(objProject, key) = $zdateh($replace(value,"/",""),8)
		}
        else {
			set $property(objProject, key) = value
		}
	}

	set tSC = objProject.%Save()

	if $$$ISERR(tSC) {
		quit $system.OBJ.DisplayError(tSC)
	}

	quit $$$OK
}

ClassMethod Delete(id As %Integer) As %Status
{
	if '##class(User.Project).%ExistsId(id) {
		set %responde.Status = "404 AQUI"
		quit $$$OK	
	}

	do ##class(User.Project).%DeleteId(id)

	quit $$$OK
}

ClassMethod NewProject() As %Status
{
	set obj = {}.%FromJSON(%request.Content)

	set project = ##class(User.Project).%New()

	set project.Code = obj.Code
	set project.Description = obj.Description
	set project.Status = obj.Status
	set project.BeginDate = $zdateh($replace(obj.BeginDate,"/",""),8)
	set project.EndDate = $zdateh($replace(obj.EndDate,"/",""),8)
	set project.Remarks = obj.Remarks

	set tSC = project.%Save()

	quit tSC
}

ClassMethod GetProject(id As %Integer) As %Status
{

	set %response.ContentType = "application/json"

	set project = ##class(User.Project).%OpenId(id)
	set obj = {}

	do obj.%Set("id", project.%Id())
	do obj.%Set("Code", project.Code)
	do obj.%Set("Description", project.Description)
	do obj.%Set("Status", project.Status)
	do obj.%Set("BeginDate", project.BeginDate)
	do obj.%Set("EndDate", project.EndDate)
	do obj.%Set("Remarks", project.Remarks)

	write obj.%ToJSON()

	quit $$$OK
}

ClassMethod Lookup() As %Status
{
	set %response.ContentType = "application/json"

	set tSC = $system.Status.OK()
	set arrayUser = []

    try {

		set oRS = ##class(%SQL.Statement).%New()

        set sql = "SELECT %ID, Code, Description FROM SQLUser.Project"

        set tSC = oRS.%Prepare(sql)

        quit:$system.Status.IsError(tSC)

        set intcolumnCount = oRS.%Metadata.columnCount

        set result = oRS.%Execute()

        if (result.%SQLCODE '< 0) {
	        while result.%Next() {
	        	set json = {}
	        	do json.%Set("ID",$number(result.ID))
	        	do json.%Set("code", result.Code)
	        	do json.%Set("description", result.Description)
				do arrayUser.%Push(json)
            }
        }
        else {
            throw ##class(%Exception.SQL).CreateFromSQLCODE(result.%SQLCODE,result.%Message)
        }
    }
    catch (oException) {
        set tSC = oException.AsStatus()
    }

   write arrayUser.%ToJSON() 

    quit tSC
}

}
