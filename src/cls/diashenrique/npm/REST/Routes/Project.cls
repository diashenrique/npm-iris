Class diashenrique.npm.REST.Routes.Project Extends %CSP.REST
{

ClassMethod List() As %Status
{
	Set %response.ContentType = "application/json"

	Set tSC = $System.Status.OK()
	Set arrayUser = []
	Set dynamicUser = { }

    Try {

		Set oRS = ##class(%SQL.Statement).%New()

        Set sql = "SELECT ID, Code, Description, Status, %External(BeginDate) As BeginDate, %External(EndDate) As EndDate, Remarks FROM SQLUser.Project"

        Set tSC = oRS.%Prepare(sql)

        Quit:$System.Status.IsError(tSC)

        Set intcolumnCount = oRS.%Metadata.columnCount

        Set result = oRS.%Execute()

        If (result.%SQLCODE '< 0) {
	        While result.%Next() {
	        	Set json = { }
	        	For i=1:1:intcolumnCount {
					Do json.%Set(oRS.%Metadata.columns.GetAt(i).colName,result.%GetData(i))
				}
				Do arrayUser.%Push(json)
            }
        }
        Else {
            Throw ##class(%Exception.SQL).CreateFromSQLCODE(result.%SQLCODE,result.%Message)
        }


    }
    Catch (oException) {
        Set tSC = oException.AsStatus()
    }

    Do dynamicUser.%Set("data",arrayUser)

    Write dynamicUser.%ToJSON() 

    Quit tSC
}

ClassMethod Update(id As %Integer) As %Status
{
	Set obj = ##class(%DynamicObject).%FromJSON(%request.Content)

	Set objProject = ##class(User.Project).%OpenId(id)

	If '$IsObject(objProject) {
		Set %response.Status = ..#HTTP404NOTFOUND
		Quit $$$OK
	}

	Set iter = obj.%GetIterator()
	While iter.%GetNext(.key , .value )  {
		If ((key = "BeginDate") || (key = "EndDate")) {
			Set $Property(objProject, key) = $ZDateh($Replace(value,"/",""),8)
		}
        Else {
			Set $Property(objProject, key) = value
		}
	}

	Set tSC = objProject.%Save()

	If $$$ISERR(tSC) {
		Quit $System.OBJ.DisplayError(tSC)
	}

	Quit $$$OK
}

ClassMethod Delete(id As %Integer) As %Status
{
	If '##class(User.Project).%ExistsId(id) {
		Set %responde.Status = "404 AQUI"
		Quit $$$OK	
	}

	Do ##class(User.Project).%DeleteId(id)

	Quit $$$OK
}

ClassMethod NewProject() As %Status
{
	Set obj = { } .%FromJSON(%request.Content)

	Set project = ##class(User.Project).%New()

	Set project.Code = obj.Code
	Set project.Description = obj.Description
	Set project.Status = obj.Status
	Set project.BeginDate = $ZDateh($Replace(obj.BeginDate,"/",""),8)
	Set project.EndDate = $ZDateh($Replace(obj.EndDate,"/",""),8)
	Set project.Remarks = obj.Remarks

	Set tSC = project.%Save()

	Quit tSC
}

ClassMethod GetProject(id As %Integer) As %Status
{

	Set %response.ContentType = "application/json"

	Set project = ##class(User.Project).%OpenId(id)
	Set obj = { }

	Do obj.%Set("id", project.%Id())
	Do obj.%Set("Code", project.Code)
	Do obj.%Set("Description", project.Description)
	Do obj.%Set("Status", project.Status)
	Do obj.%Set("BeginDate", project.BeginDate)
	Do obj.%Set("EndDate", project.EndDate)
	Do obj.%Set("Remarks", project.Remarks)

	Write obj.%ToJSON()

	Quit $$$OK
}

ClassMethod Lookup() As %Status
{
	Set %response.ContentType = "application/json"

	Set tSC = $System.Status.OK()
	Set arrayUser = []

    Try {

		Set oRS = ##class(%SQL.Statement).%New()

        Set sql = "SELECT %ID, Code, Description FROM SQLUser.Project"

        Set tSC = oRS.%Prepare(sql)

        Quit:$System.Status.IsError(tSC)

        Set intcolumnCount = oRS.%Metadata.columnCount

        Set result = oRS.%Execute()

        If (result.%SQLCODE '< 0) {
	        While result.%Next() {
	        	Set json = { }
	        	Do json.%Set("ID",$Number(result.ID))
	        	Do json.%Set("code", result.Code)
	        	Do json.%Set("description", result.Description)
				Do arrayUser.%Push(json)
            }
        }
        Else {
            Throw ##class(%Exception.SQL).CreateFromSQLCODE(result.%SQLCODE,result.%Message)
        }
    }
    Catch (oException) {
        Set tSC = oException.AsStatus()
    }

   Write arrayUser.%ToJSON() 

    Quit tSC
}

}
