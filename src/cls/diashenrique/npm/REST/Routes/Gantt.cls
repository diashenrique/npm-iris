Class diashenrique.npm.REST.Routes.Gantt Extends %CSP.REST
{

ClassMethod List() As %Status
{
    Set %response.ContentType = "application/json"

    Set tSC = $System.Status.OK()
    Set arrayTask = []

    Try {

        Set oRS = ##class(%SQL.Statement).%New()

        Set sql = "SELECT ID, AssignedUser, TaskName, %EXTERNAL(StartDate) as StartDate, %EXTERNAL(DueDate) as DueDate, Status, Priority, Progress, NVL(ParentId,0) as ParentId, PredecessorId, SucessorId FROM SQLUser.Task"

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
                Do arrayTask.%Push(json)
            }
        }
        Else {
            Throw ##class(%Exception.SQL).CreateFromSQLCODE(result.%SQLCODE,result.%Message)
        }


    }
    Catch (oException) {
        Set tSC = oException.AsStatus()
    }

    Write arrayTask.%ToJSON() 

    Quit tSC
}

ClassMethod Update(id As %Integer) As %Status
{
    Set obj = ##class(%DynamicObject).%FromJSON(%request.Content)

    Set objTask = ##class(User.Task).%OpenId(id)

    If '$IsObject(objTask) {
        Set %response.Status = ..#HTTP404NOTFOUND
        Quit $$$OK
    }

    Set iter = obj.%GetIterator()
    While iter.%GetNext(.key , .value )  {
        If ((key = "StartDate") || (key = "DueDate")) {
            Set $Property(objTask, key) = $ZDateh($Replace(value,"/",""),8)
        }
        ElseIf (key = "AssignedUser") {
            Set $Property(objTask, key) = ##class(User.Person).%OpenId(value) 
        }	 
        Else {
            Set $Property(objTask, key) = value
        }
    }

    Set tSC = objTask.%Save()

    If $$$ISERR(tSC) {
        Quit $System.OBJ.DisplayError(tSC)
    }

    Quit $$$OK
}

ClassMethod GetTask(id As %Integer) As %Status
{

    Set %response.ContentType = "application/json"

    Set objTask = ##class(User.Task).%OpenId(id)
    Set obj = { }

    Do obj.%Set("id", objTask.%Id())
    Do obj.%Set("TaskName", objTask.TaskName)
    Do obj.%Set("StartDate", objTask.StartDate)
    Do obj.%Set("DueDate", objTask.DueDate)
    Do obj.%Set("Progress", objTask.Progress)
    Do obj.%Set("Priority", objTask.Priority)
    Do obj.%Set("Status", objTask.Status)
    Do obj.%Set("AssignedUser", objTask.AssignedUser)
    Do obj.%Set("ParentId", objTask.ParentId)
    Do obj.%Set("PredecessorId", objTask.PredecessorId)
    Do obj.%Set("SucessorId", objTask.SucessorId)

    Write obj.%ToJSON()

    Quit $$$OK
}

ClassMethod NewTask() As %Status
{
    #dim task As User.Task

    Set obj = { } .%FromJSON(%request.Content)

    Set objTask = ##class(User.Task).%New()

    Set objTask.TaskName = obj.TaskName
    Set objTask.StartDate = $ZDateh($Replace(obj.StartDate,"/",""),8)
    Set objTask.DueDate = $ZDateh($Replace(obj.DueDate,"/",""),8)
    Set objTask.Progress = obj.Progress
    Set objTask.Priority = obj.Priority
    Set objTask.Status = obj.Status
    Set objTask.AssignedUser = ##class(User.Person).%OpenId(obj.AssignedUser)
    ;set objTask.ParentId = obj.ParentId
    ;set objTask.PredecessorId = obj.PredecessorId
    ;set objTask.SucessorId = obj.SucessorId

    Set tSC = objTask.%Save()

    If $$$ISERR(tSC) {
        Quit $System.OBJ.DisplayError(tSC)
    }

    Quit tSC
}

ClassMethod Delete(id As %Integer) As %Status
{
    If '##class(User.Task).%ExistsId(id) {
        Set %responde.Status = ..#HTTP404NOTFOUND
        Quit $$$OK	
    }

    Do ##class(User.Task).%DeleteId(id)

    Quit $$$OK
}

ClassMethod Dependence() As %Status
{
    Set %response.ContentType = "application/json"

    Set tSC = $System.Status.OK()
    Set arrayTask = []

    Try {

        Set oRS = ##class(%SQL.Statement).%New()

        Set sql = "SELECT ID, PredecessorId, SucessorId, Type FROM SQLUser.TaskDependence"

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
                Do arrayTask.%Push(json)
            }
        }
        Else {
            Throw ##class(%Exception.SQL).CreateFromSQLCODE(result.%SQLCODE,result.%Message)
        }


    }
    Catch (oException) {
        Set tSC = oException.AsStatus()
    }

    Write arrayTask.%ToJSON() 

    Quit tSC
}

ClassMethod NewTaskDependence() As %Status
{
    #dim objTaskDependence As User.TaskDependence

    Set obj = ##class(%DynamicObject).%FromJSON(%request.Content)

    Set objTaskDependence = ##class(User.TaskDependence).%New()

    Set objTaskDependence.PredecessorId = ##class(User.Task).%OpenId(obj.PredecessorId)
    Set objTaskDependence.SucessorId = ##class(User.Task).%OpenId(obj.SucessorId)
    Set objTaskDependence.Type = obj.Type

    Set tSC = objTaskDependence.%Save()

    If $$$ISERR(tSC) {
        Quit $System.OBJ.DisplayError(tSC)
    }

    Quit $$$OK
}

ClassMethod GetTaskDependence(id As %Integer) As %Status
{

    Set %response.ContentType = "application/json"

    Set objTaskDependence = ##class(User.TaskDependence).%OpenId(id)
    Set obj = { }

    Do obj.%Set("id", objTaskDependence.%Id())
    Do obj.%Set("PredecessorId", objTaskDependence.PredecessorId)
    Do obj.%Set("SucessorId", objTaskDependence.SucessorId)
    Do obj.%Set("Type", objTaskDependence.Type)

    Write obj.%ToJSON()

    Quit $$$OK
}

ClassMethod UpdateDependence(id As %Integer) As %Status
{
    Set obj = ##class(%DynamicObject).%FromJSON(%request.Content)

    Set objTaskDependence = ##class(User.TaskDependence).%OpenId(id)

    If '$IsObject(objTaskDependence) {
        Set %response.Status = ..#HTTP404NOTFOUND
        Quit $$$OK
    }

    Set iter = obj.%GetIterator()
    While iter.%GetNext(.key , .value )  {
        If ((key = "PredecessorId") || (key = "SucessorId")) {
            Set $Property(objTaskDependence, key) = ##class(User.Task).%OpenId(value)
        }
        Else {
            Set $Property(objTaskDependence, key) = value
        }
    }

    Set tSC = objTaskDependence.%Save()

    If $$$ISERR(tSC) {
        Quit $System.OBJ.DisplayError(tSC)
    }

    Quit $$$OK
}

ClassMethod DeleteDependence(id As %Integer) As %Status
{
    If '##class(User.TaskDependence).%ExistsId(id) {
        Set %responde.Status = ..#HTTP404NOTFOUND
        Quit $$$OK	
    }

    Do ##class(User.TaskDependence).%DeleteId(id)

    Quit $$$OK
}

ClassMethod Resource() As %Status
{
    Set %response.ContentType = "application/json"

    Set tSC = $System.Status.OK()
    Set arrayTask = []

    Try {

        Set oRS = ##class(%SQL.Statement).%New()

        Set sql = "SELECT ID, UserName FROM SQLUser.Person"

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
                Do arrayTask.%Push(json)
            }
        }
        Else {
            Throw ##class(%Exception.SQL).CreateFromSQLCODE(result.%SQLCODE,result.%Message)
        }


    }
    Catch (oException) {
        Set tSC = oException.AsStatus()
    }

    Write arrayTask.%ToJSON() 

    Quit tSC
}

ClassMethod ResourceAssignment() As %Status
{
    Set %response.ContentType = "application/json"

    Set tSC = $System.Status.OK()
    Set arrayTask = []

    Try {

        Set oRS = ##class(%SQL.Statement).%New()

        Set sql = "SELECT ID, AssignedUser FROM SQLUser.Task"

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
                Do arrayTask.%Push(json)
            }
        }
        Else {
            Throw ##class(%Exception.SQL).CreateFromSQLCODE(result.%SQLCODE,result.%Message)
        }


    }
    Catch (oException) {
        Set tSC = oException.AsStatus()
    }

    Write arrayTask.%ToJSON() 

    Quit tSC
}

ClassMethod UpdateResourceAssignment(id As %Integer) As %Status
{
    Set obj = ##class(%DynamicObject).%FromJSON(%request.Content)

    Set objTask = ##class(User.Task).%OpenId(id)

    If '$IsObject(objTask) {
        Set %response.Status = ..#HTTP404NOTFOUND
        Quit $$$OK
    }

    Set iter = obj.%GetIterator()
    While iter.%GetNext(.key , .value )  {
        If (key = "AssignedUser") {
            Set $Property(objTask, key) = ##class(User.Person).%OpenId(value) 
        }	 
        Else {
            Set $Property(objTask, key) = value
        }
    }

    Set tSC = objTask.%Save()

    If $$$ISERR(tSC) {
        Quit $System.OBJ.DisplayError(tSC)
    }

    Quit $$$OK
}

}
