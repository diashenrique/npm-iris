Class REST.Routes.Team Extends %CSP.REST
{

ClassMethod List() As %Status
{
	set %response.ContentType = "application/json"

	set tSC = $system.Status.OK()
	set arrayTeam = []
	set dynamicTeam = {}

    try {

		set oRS = ##class(%SQL.Statement).%New()

        set sql = "SELECT ID, TeamName, Description, Active FROM SQLUser.Team"

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
				do arrayTeam.%Push(json)
            }
        }
        else {
            throw ##class(%Exception.SQL).CreateFromSQLCODE(result.%SQLCODE,result.%Message)
        }
    }
    catch (oException) {
        set tSC = oException.AsStatus()
    }

    do dynamicTeam.%Set("data", arrayTeam)

    write dynamicTeam.%ToJSON() 

    quit tSC
}

ClassMethod Update(id As %Integer) As %Status
{
	set obj = ##class(%DynamicObject).%FromJSON(%request.Content)

	set objTeam = ##class(User.Team).%OpenId(id)

	if '$isobject(objTeam) {
		set %response.Status = ..#HTTP404NOTFOUND
		quit $$$OK
	}

	if obj.%IsDefined("TeamName") {
		set objTeam.TeamName = obj.TeamName	
	}

	if obj.%IsDefined("Description") {
		set objTeam.Description = obj.Description	
	}

	if obj.%IsDefined("Active") {
		set objTeam.Active = obj.Active	
	}

	// Saving Team
	tstart 

	set tSC = objTeam.%Save()

	if ($$$ISOK(tSC)) {
		// Saving Team Members
		if obj.%IsDefined("MemberID") {
			set iter = obj.MemberID.%GetIterator()
			while iter.%GetNext(.key , .value )  {
				// Each value has the User ID 
				if '##class(User.TeamMember).%ExistsId(id_"||"_value) {
					set tTeamMember = ##class(User.TeamMember).%New()
					set tTeamMember.Team = ##class(User.Team).%OpenId(id)
					set tTeamMember.Member = ##class(User.Person).%OpenId(value)
					set tTeamMember.Active = 1
					set tSC = tTeamMember.%Save()
				}
				quit:$$$ISERR(tSC) 
			}
		}
	}

	// if everything is Ok, Commit the transaction
	if ($$$ISOK(tSC)) {
		tcommit	
	}
    else {
		trollback 
	}


	quit $$$OK
}

ClassMethod Delete(id As %Integer) As %Status
{
	if '##class(User.Team).%ExistsId(id) {
		set %responde.Status = ..#HTTP404NOTFOUND
		quit $$$OK	
	}

	do ##class(User.Team).%DeleteId(id)

	quit $$$OK
}

ClassMethod NewTeam() As %Status
{
	set obj = {}.%FromJSON(%request.Content)

	set objTeam = ##class(User.Team).%New()

	set objTeam.TeamName = obj.TeamName	
	set objTeam.Description = obj.Description	
	set objTeam.Active = obj.Active	

	set tSC = objTeam.%Save()

	if ($$$ISOK(tSC)) {
		// Saving Team Members
		if obj.%IsDefined("MemberID") {
			set iter = obj.MemberID.%GetIterator()
			while iter.%GetNext(.key , .value )  {
				// Each value has the User ID 
				if '##class(User.TeamMember).%ExistsId(objTeam.%Id()_"||"_value) {
					set tTeamMember = ##class(User.TeamMember).%New()
					set tTeamMember.Team = objTeam
					set tTeamMember.Member = ##class(User.Person).%OpenId(value)
					set tTeamMember.Active = 1
					set tSC = tTeamMember.%Save()
				}
				quit:$$$ISERR(tSC) 
			}
		}
	}

	quit tSC
}

ClassMethod GetTeam(id As %Integer) As %Status
{

	set %response.ContentType = "application/json"

	set objTeam = ##class(User.Team).%OpenId(id)
	set obj = {}

	do obj.%Set("id", objTeam.%Id())
	do obj.%Set("TeamName", objTeam.TeamName)
	do obj.%Set("Description", objTeam.Description)
	do obj.%Set("Active", objTeam.Active)

	write obj.%ToJSON()

	quit $$$OK
}

}
