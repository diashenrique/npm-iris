Class REST.Routes.Gantt Extends %CSP.REST
{

ClassMethod List() As %Status
{
    set %response.ContentType = "application/json"

    set tSC = $system.Status.OK()
    set arrayTask = []

    try {

        set oRS = ##class(%SQL.Statement).%New()

        set sql = "SELECT ID, AssignedUser, TaskName, %EXTERNAL(StartDate) as StartDate, %EXTERNAL(DueDate) as DueDate, Status, Priority, Progress, NVL(ParentId,0) as ParentId, PredecessorId, SucessorId FROM SQLUser.Task"

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

    write arrayTask.%ToJSON() 

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
    ;set objTask.ParentId = obj.ParentId
    ;set objTask.PredecessorId = obj.PredecessorId
    ;set objTask.SucessorId = obj.SucessorId

    set tSC = objTask.%Save()

    if $$$ISERR(tSC) {
        quit $system.OBJ.DisplayError(tSC)
    }

    quit tSC
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

ClassMethod Dependence() As %Status
{
    set %response.ContentType = "application/json"

    set tSC = $system.Status.OK()
    set arrayTask = []

    try {

        set oRS = ##class(%SQL.Statement).%New()

        set sql = "SELECT ID, PredecessorId, SucessorId, Type FROM SQLUser.TaskDependence"

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

    write arrayTask.%ToJSON() 

    quit tSC
}

ClassMethod NewTaskDependence() As %Status
{
    #dim objTaskDependence As User.TaskDependence

    set obj = ##class(%DynamicObject).%FromJSON(%request.Content)

    set objTaskDependence = ##class(User.TaskDependence).%New()

    set objTaskDependence.PredecessorId = ##class(User.Task).%OpenId(obj.PredecessorId)
    set objTaskDependence.SucessorId = ##class(User.Task).%OpenId(obj.SucessorId)
    set objTaskDependence.Type = obj.Type

    set tSC = objTaskDependence.%Save()

    if $$$ISERR(tSC) {
        quit $system.OBJ.DisplayError(tSC)
    }

    quit $$$OK
}

ClassMethod GetTaskDependence(id As %Integer) As %Status
{

    set %response.ContentType = "application/json"

    set objTaskDependence = ##class(User.TaskDependence).%OpenId(id)
    set obj = {}

    do obj.%Set("id", objTaskDependence.%Id())
    do obj.%Set("PredecessorId", objTaskDependence.PredecessorId)
    do obj.%Set("SucessorId", objTaskDependence.SucessorId)
    do obj.%Set("Type", objTaskDependence.Type)

    write obj.%ToJSON()

    quit $$$OK
}

ClassMethod UpdateDependence(id As %Integer) As %Status
{
    set obj = ##class(%DynamicObject).%FromJSON(%request.Content)

    set objTaskDependence = ##class(User.TaskDependence).%OpenId(id)

    if '$isobject(objTaskDependence) {
        set %response.Status = ..#HTTP404NOTFOUND
        quit $$$OK
    }

    set iter = obj.%GetIterator()
    while iter.%GetNext(.key , .value )  {
        if ((key = "PredecessorId") || (key = "SucessorId")) {
            set $property(objTaskDependence, key) = ##class(User.Task).%OpenId(value)
        }
        else {
            set $property(objTaskDependence, key) = value
        }
    }

    set tSC = objTaskDependence.%Save()

    if $$$ISERR(tSC) {
        quit $system.OBJ.DisplayError(tSC)
    }

    quit $$$OK
}

ClassMethod DeleteDependence(id As %Integer) As %Status
{
    if '##class(User.TaskDependence).%ExistsId(id) {
        set %responde.Status = ..#HTTP404NOTFOUND
        quit $$$OK	
    }

    do ##class(User.TaskDependence).%DeleteId(id)

    quit $$$OK
}

ClassMethod Resource() As %Status
{
    set %response.ContentType = "application/json"

    set tSC = $system.Status.OK()
    set arrayTask = []

    try {

        set oRS = ##class(%SQL.Statement).%New()

        set sql = "SELECT ID, UserName FROM SQLUser.Person"

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

    write arrayTask.%ToJSON() 

    quit tSC
}

ClassMethod ResourceAssignment() As %Status
{
    set %response.ContentType = "application/json"

    set tSC = $system.Status.OK()
    set arrayTask = []

    try {

        set oRS = ##class(%SQL.Statement).%New()

        set sql = "SELECT ID, AssignedUser FROM SQLUser.Task"

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

    write arrayTask.%ToJSON() 

    quit tSC
}

ClassMethod UpdateResourceAssignment(id As %Integer) As %Status
{
    set obj = ##class(%DynamicObject).%FromJSON(%request.Content)

    set objTask = ##class(User.Task).%OpenId(id)

    if '$isobject(objTask) {
        set %response.Status = ..#HTTP404NOTFOUND
        quit $$$OK
    }

    set iter = obj.%GetIterator()
    while iter.%GetNext(.key , .value )  {
        if (key = "AssignedUser") {
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

}
