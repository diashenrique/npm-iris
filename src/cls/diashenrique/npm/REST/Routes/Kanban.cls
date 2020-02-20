Class diashenrique.npm.REST.Routes.Kanban Extends %CSP.REST
{

ClassMethod List() As %Status
{
    Set %response.ContentType = "application/json"

    Set tSC = $System.Status.OK()
    Set arrayTask = []
    Set dynamicTask = { }

    Try {

        Set oRS = ##class(%SQL.Statement).%New()

        Set sql = "SELECT ID, AssignedUser, TaskName, TO_CHAR(StartDate,'YYYY/MM/DD') As StartDate, TO_CHAR(DueDate,'YYYY/MM/DD') As DueDate, Status, Priority, "_
                "Progress, %EXTERNAL(TrackingStatus) As TrackingStatus, ParentId FROM diashenrique_npm_Data.Task"

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

    Set objTask = ##class(diashenrique.npm.Data.Task).%OpenId(id)

    If '$IsObject(objTask) {
        Set %response.Status = ..#HTTP404NOTFOUND
        Quit $$$OK
    }

    Kill ^zHGD

    Set iter = obj.%GetIterator()
    While iter.%GetNext(.key , .value )  {
        Continue:key="ID"
        If ((key = "StartDate") || (key = "DueDate")) {
            Set $Property(objTask, key) = $ZDateh($Replace(value,"/","-"),3)
        }
        ElseIf (key = "AssignedUser") {
            Set $Property(objTask, key) = ##class(diashenrique.npm.Data.Person).%OpenId(value) 
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

ClassMethod GetKanban(id As %Integer) As %Status
{

    Set %response.ContentType = "application/json"

    Set objTask = ##class(diashenrique.npm.Data.Task).%OpenId(id)
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
    #dim task As diashenrique.npm.Data.Task

    Set obj = ##class(%DynamicObject).%FromJSON(%request.Content)

    Set objTask = ##class(diashenrique.npm.Data.Task).%New()

    Set objTask.TaskName = obj.TaskName
    Set objTask.StartDate = $ZDateh($Replace(obj.StartDate,"/",""),8)
    Set objTask.DueDate = $ZDateh($Replace(obj.DueDate,"/",""),8)
    Set objTask.Progress = obj.Progress
    Set objTask.Priority = obj.Priority
    Set objTask.Status = obj.Status
    If (obj.AssignedUser '= "") {
        Set objTask.AssignedUser = ##class(diashenrique.npm.Data.Person).%OpenId(obj.AssignedUser)
    }

    Set tSC = objTask.%Save()

    Quit tSC
}

}
