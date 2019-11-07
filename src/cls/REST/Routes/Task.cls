Class REST.Routes.Task Extends %CSP.REST
{

ClassMethod TreeList() As %Status
{
    set %response.ContentType = "application/json"

    set tSC = $system.Status.OK()
    set arrayTask = []
    set dynamicTask = {}

    try {

        set oRS = ##class(%SQL.Statement).%New()

        set sql = "SELECT ID, TaskName, %EXTERNAL(StartDate) As StartDate, %EXTERNAL(DueDate) As DueDate, Priority, Status, Progress, AssignedUser, NVL(ParentId,0) as ParentId, ProjectId FROM SQLUser.Task"

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
                do arrayTask.%Push(json)
            }
        }
        else {
            throw ##class(%Exception.SQL).CreateFromSQLCODE(result.%SQLCODE,result.%Message)
        }


    }
    catch (oException) {
        set tSC = oException.AsStatus()
    }

    do dynamicTask.%Set("data",arrayTask)

    write dynamicTask.%ToJSON() 

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
        set ^zHGD($zname,"Update",key) = value
        if ((key = "StartDate") || (key = "DueDate")) {
            set $property(objTask, key) = $zdateh($replace(value,"/",""),8)
        }
        elseif (key = "AssignedUser") {
            set $property(objTask, key) = ##class(User.Person).%OpenId(value) 
        }	 
        elseif (key = "ParentId") {
            set $property(objTask, key) = ##class(User.Task).%OpenId(value)
        }	 
        elseif (key = "ProjectId") {
            set $property(objTask, key) = ##class(User.Project).%OpenId(value)
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

ClassMethod NewTask() As %Status
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
    set objTask.ParentId = ##class(User.Task).%OpenId(obj.ParentId)
    ;set objTask.PredecessorId = obj.PredecessorId
    ;set objTask.SucessorId = obj.SucessorId

    set tSC = objTask.%Save()

    if $$$ISOK(tSC) {
        set ^zHGD("NewTask","%Oid")=objTask.%Oid()
        set ^zHGD("NewTask","%Id")=objTask.%Id()
    }

    quit tSC
}

ClassMethod GetTask(id As %Integer) As %Status
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
