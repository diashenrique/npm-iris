Class diashenrique.npm.REST.Routes.User Extends %CSP.REST
{

ClassMethod List() As %Status
{
	Set %response.ContentType = "application/json"

	Set tSC = $System.Status.OK()
	Set arrayUser = []
	Set dynamicUser = { }

    Try {

		Set oRS = ##class(%SQL.Statement).%New()

        Set sql = "SELECT ID,UserName,Name,email,%External(DateOfBirth) as DateOfBirth,JobTitle,Company,ProfileHeading,PhotoProfile,Active,"_
				"Password FROM diashenrique_npm_Data.Person"

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

	Set objUser = ##class(diashenrique.npm.Data.Person).%OpenId(id)

	If '$IsObject(objUser) {
		Set %response.Status = ..#HTTP404NOTFOUND
		Quit $$$OK
	}

	Set iter = obj.%GetIterator()
	While iter.%GetNext(.key , .value )  {
		If (key = "DateOfBirth") {
			Set $Property(objUser, key) = $ZDateh($Replace(value,"/",""),8)
		}
        Else {
			Set $Property(objUser, key) = value
		}
	}

	Set tSC = objUser.%Save()

	If $$$ISERR(tSC) {
		Quit $System.OBJ.DisplayError(tSC)
	}

	Quit $$$OK
}

ClassMethod Delete(id As %Integer) As %Status
{
	If '##class(diashenrique.npm.Data.Person).%ExistsId(id) {
		Set %responde.Status = "404 AQUI"
		Quit $$$OK	
	}

	Do ##class(diashenrique.npm.Data.Person).%DeleteId(id)

	Quit $$$OK
}

ClassMethod NewUser() As %Status
{
	Set obj = ##class(%DynamicAbstractObject).%FromJSON(%request.Content)

	Set user = ##class(diashenrique.npm.Data.Person).%New()

	Set user.UserName = obj.UserName
	Set user.Name = obj.Name
	Set user.email = obj.email
	Set user.DateOfBirth = $ZDateh($Replace(obj.DateOfBirth,"/",""),8)
	Set user.JobTitle = obj.JobTitle
	Set user.Company = obj.Company
	Set user.ProfileHeading = obj.ProfileHeading
	Set user.Active = obj.Active

	Set tSC = user.%Save()

	Quit tSC
}

ClassMethod GetUser(id As %Integer) As %Status
{

	Set %response.ContentType = "application/json"

	Set user = ##class(diashenrique.npm.Data.Person).%OpenId(id)
	Set obj = { }

	Do obj.%Set("id", user.%Id())
	Do obj.%Set("UserName", user.UserName)
	Do obj.%Set("Name", user.Name)
	Do obj.%Set("email", user.email)
	Do obj.%Set("DateOfBirth", user.DateOfBirth)
	Do obj.%Set("JobTitle", user.JobTitle)
	Do obj.%Set("Company", user.Company)
	Do obj.%Set("ProfileHeading", user.ProfileHeading)
	Do obj.%Set("Active", user.Active)

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

        Set sql = "SELECT %ID, UserName, Name FROM diashenrique_npm_Data.Person"

        Set tSC = oRS.%Prepare(sql)

        Quit:$System.Status.IsError(tSC)

        Set intcolumnCount = oRS.%Metadata.columnCount

        Set result = oRS.%Execute()

        If (result.%SQLCODE '< 0) {
	        While result.%Next() {
	        	Set json = { }
	        	Do json.%Set("ID",$Number(result.ID))
	        	Do json.%Set("userName", result.UserName)
	        	Do json.%Set("name", result.Name)
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
