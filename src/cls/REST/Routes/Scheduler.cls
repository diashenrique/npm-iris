Class REST.Routes.Scheduler Extends %CSP.REST
{

ClassMethod List() As %Status
{
    ;set %response.ContentType = "application/json"

    set tSC = $system.Status.OK()
    set arrayScheduler = []

    try {

        set oRS = ##class(%SQL.Statement).%New()

        set sql = "SELECT ID, TaskName, %EXTERNAL(StartDate) As StartDate, %EXTERNAL(DueDate) As DueDate, Priority, Status, Progress, AssignedUser, ParentId, PredecessorId, SucessorId FROM SQLUser.Task"

        set tSC = oRS.%Prepare(sql)

        quit:$system.Status.IsError(tSC)

        set result = oRS.%Execute()

        if (result.%SQLCODE '< 0) {
            while result.%Next() {
                set json = {}
				do json.%Set("ID", result.ID)
				do json.%Set("text", result.TaskName)
				do json.%Set("startDate", result.StartDate)
				do json.%Set("endDate", result.DueDate)
				do arrayScheduler.%Push(json)
            }
        }
        else {
            throw ##class(%Exception.SQL).CreateFromSQLCODE(result.%SQLCODE,result.%Message)
        }
    }
    catch (oException) {
        set tSC = oException.AsStatus()
    }

    write arrayScheduler.%ToJSON() 

    quit tSC
}

ClassMethod Update(id As %Integer) As %Status
{
    set obj = ##class(%DynamicObject).%FromJSON(%request.Content)

    set objTask = ##class(User.Task).%OpenId(id)

    if '$isobject(objTask) {
        set %response.Status = ..#HTTP404NOTFOUND
        quit $$$OK
    }

    set iter = obj.%GetIterator()
    while iter.%GetNext(.key , .value )  {
        if ((key = "StartDate") || (key = "DueDate")) {
            set $property(objTask, key) = $zdateh($replace(value,"/",""),8)
        }
        elseif (key = "AssignedUser") {
            set $property(objTask, key) = ##class(User.Person).%OpenId(value) 
        }	 
        else {
            set $property(objTask, key) = value
        }
    }

    set tSC = objTask.%Save()

    if $$$ISERR(tSC) {
        quit $system.OBJ.DisplayError(tSC)
    }

    quit $$$OK
}

ClassMethod Delete(id As %Integer) As %Status
{
    if '##class(User.Task).%ExistsId(id) {
        set %responde.Status = ..#HTTP404NOTFOUND
        quit $$$OK	
    }

    do ##class(User.Task).%DeleteId(id)

    quit $$$OK
}

ClassMethod NewScheduler() As %Status
{
    #dim task As User.Task

    set obj = {}.%FromJSON(%request.Content)

    set objTask = ##class(User.Task).%New()

    set objTask.TaskName = obj.TaskName
    set objTask.StartDate = $zdateh($replace(obj.StartDate,"/",""),8)
    set objTask.DueDate = $zdateh($replace(obj.DueDate,"/",""),8)
    set objTask.Progress = obj.Progress
    set objTask.Priority = obj.Priority
    set objTask.Status = obj.Status
    set objTask.AssignedUser = ##class(User.Person).%OpenId(obj.AssignedUser)
    ;set objTask.ParentId = obj.ParentId
    ;set objTask.PredecessorId = obj.PredecessorId
    ;set objTask.SucessorId = obj.SucessorId

    set tSC = objTask.%Save()

    if $$$ISOK(tSC) {
        set ^zHGD("NewTask","%Oid")=objTask.%Oid()
        set ^zHGD("NewTask","%Id")=objTask.%Id()
    }

    quit tSC
}

ClassMethod GetScheduler(id As %Integer) As %Status
{

    set %response.ContentType = "application/json"

    set objTask = ##class(User.Task).%OpenId(id)
    set obj = {}

    do obj.%Set("id", objTask.%Id())
    do obj.%Set("TaskName", objTask.TaskName)
    do obj.%Set("StartDate", objTask.StartDate)
    do obj.%Set("DueDate", objTask.DueDate)
    do obj.%Set("Progress", objTask.Progress)
    do obj.%Set("Priority", objTask.Priority)
    do obj.%Set("Status", objTask.Status)
    do obj.%Set("AssignedUser", objTask.AssignedUser)
    do obj.%Set("ParentId", objTask.ParentId)
    do obj.%Set("PredecessorId", objTask.PredecessorId)
    do obj.%Set("SucessorId", objTask.SucessorId)

    write obj.%ToJSON()

    quit $$$OK
}

}
