Class diashenrique.npm.REST.Routes.Team Extends %CSP.REST
{

ClassMethod List() As %Status
{
	Set %response.ContentType = "application/json"

	Set tSC = $System.Status.OK()
	Set arrayTeam = []
	Set dynamicTeam = { }

    Try {

		Set oRS = ##class(%SQL.Statement).%New()

        Set sql = "SELECT ID, TeamName, Description, Active FROM diashenrique_npm_Data.Team"

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
				Do arrayTeam.%Push(json)
            }
        }
        Else {
            Throw ##class(%Exception.SQL).CreateFromSQLCODE(result.%SQLCODE,result.%Message)
        }
    }
    Catch (oException) {
        Set tSC = oException.AsStatus()
    }

    Do dynamicTeam.%Set("data", arrayTeam)

    Write dynamicTeam.%ToJSON() 

    Quit tSC
}

ClassMethod Update(id As %Integer) As %Status
{
	Set obj = ##class(%DynamicObject).%FromJSON(%request.Content)

	Set objTeam = ##class(diashenrique.npm.Data.Team).%OpenId(id)

	If '$IsObject(objTeam) {
		Set %response.Status = ..#HTTP404NOTFOUND
		Quit $$$OK
	}

	If obj.%IsDefined("TeamName") {
		Set objTeam.TeamName = obj.TeamName	
	}

	If obj.%IsDefined("Description") {
		Set objTeam.Description = obj.Description	
	}

	If obj.%IsDefined("Active") {
		Set objTeam.Active = obj.Active	
	}

	// Saving Team
	TStart 

	Set tSC = objTeam.%Save()

	If ($$$ISOK(tSC)) {
		// Saving Team Members
		If obj.%IsDefined("MemberID") {
			Set iter = obj.MemberID.%GetIterator()
			While iter.%GetNext(.key , .value )  {
				// Each value has the User ID 
				If '##class(diashenrique.npm.Data.TeamMember).%ExistsId(id_"||"_value) {
					Set tTeamMember = ##class(diashenrique.npm.Data.TeamMember).%New()
					Set tTeamMember.Team = ##class(diashenrique.npm.Data.Team).%OpenId(id)
					Set tTeamMember.Member = ##class(diashenrique.npm.Data.Person).%OpenId(value)
					Set tTeamMember.Active = 1
					Set tSC = tTeamMember.%Save()
				}
				Quit:$$$ISERR(tSC) 
			}
		}
	}

	// if everything is Ok, Commit the transaction
	If ($$$ISOK(tSC)) {
		TCommit	
	}
    Else {
		TROllback 
	}


	Quit $$$OK
}

ClassMethod Delete(id As %Integer) As %Status
{
	If '##class(diashenrique.npm.Data.Team).%ExistsId(id) {
		Set %responde.Status = ..#HTTP404NOTFOUND
		Quit $$$OK	
	}

	Do ##class(diashenrique.npm.Data.Team).%DeleteId(id)

	Quit $$$OK
}

ClassMethod NewTeam() As %Status
{
	Set obj = ##class(%DynamicAbstractObject).%FromJSON(%request.Content)

	Set objTeam = ##class(User.Team).%New()

	Set objTeam.TeamName = obj.TeamName	
	Set objTeam.Description = obj.Description	
	Set objTeam.Active = obj.Active	

	Set tSC = objTeam.%Save()

	If ($$$ISOK(tSC)) {
		// Saving Team Members
		If obj.%IsDefined("MemberID") {
			Set iter = obj.MemberID.%GetIterator()
			While iter.%GetNext(.key , .value )  {
				// Each value has the User ID 
				If '##class(diashenrique.npm.Data.TeamMember).%ExistsId(objTeam.%Id()_"||"_value) {
					Set tTeamMember = ##class(diashenrique.npm.Data.TeamMember).%New()
					Set tTeamMember.Team = objTeam
					Set tTeamMember.Member = ##class(diashenrique.npm.Data.Person).%OpenId(value)
					Set tTeamMember.Active = 1
					Set tSC = tTeamMember.%Save()
				}
				Quit:$$$ISERR(tSC) 
			}
		}
	}

	Quit tSC
}

ClassMethod GetTeam(id As %Integer) As %Status
{

	Set %response.ContentType = "application/json"

	Set objTeam = ##class(diashenrique.npm.Data.Team).%OpenId(id)
	Set obj = { }

	Do obj.%Set("id", objTeam.%Id())
	Do obj.%Set("TeamName", objTeam.TeamName)
	Do obj.%Set("Description", objTeam.Description)
	Do obj.%Set("Active", objTeam.Active)

	Write obj.%ToJSON()

	Quit $$$OK
}

}
