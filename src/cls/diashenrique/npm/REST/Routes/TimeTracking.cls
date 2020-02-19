Class diashenrique.npm.REST.Routes.TimeTracking Extends %CSP.REST
{

ClassMethod List() As %Status
{
    Set %response.ContentType = "application/json"

    Set tSC = $System.Status.OK()
    Set arrayTask = []
    Set dynamicTask = { }

    Try {

        Set oRS = ##class(%SQL.Statement).%New()

        Set sql = "SELECT ID, AssignedUser, TaskName, TO_CHAR(StartDate,'YYYY/MM/DD') As StartDate, TO_CHAR(DueDate,'YYYY/MM/DD') As DueDate, Status, Priority, Progress, %EXTERNAL(TrackingStatus) As TrackingStatus, ParentId FROM SQLUser.Task"

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
    Set obj = { } .%FromJSON(%request.Content)

    If (id = "") {
        Set %response.Status = ..#HTTP404NOTFOUND
        Quit $$$OK
    }

    Set idTimeTracking = ""

    &SQL(SELECT ID INTO :idTimeTracking FROM SQLUser.TimeTracking WHERE TaskId = :id AND UserId = 4 AND EndTracking IS NULL)

    Set objTimeTracking = ##class(User.TimeTracking).%OpenId(idTimeTracking)

    Set objTimeTracking.EndTracking = $ZDatetime($Horolog,3)

    Set tSC = objTimeTracking.%Save()

    If $$$ISERR(tSC) {
        Quit $System.OBJ.DisplayError(tSC)
    }

    Quit $$$OK
}

ClassMethod GetTimeTrackingByTask(id As %Integer) As %Status
{
    Set %response.ContentType = "application/json"

    Set strTotalTime = ##class(Util.TimeTracking).GetTotalTimeByTask(id)

    Set obj = { } 

    Do obj.%Set("totalTime",strTotalTime)

    Write obj.%ToJSON() 

    Quit $$$OK
}

ClassMethod NewTimeTracking(pTaskId As %Integer) As %Status
{
    Set obj = ##class(%DynamicObject).%FromJSON(%request.Content)

    Set objTask = ##class(User.Task).%OpenId(pTaskId)

    If '$IsObject(objTask) {
        Set %response.Status = ..#HTTP404NOTFOUND
        Quit $$$OK
    }

    Set objTimeTracking = ##class(User.TimeTracking).%New()

    Set objTimeTracking.TaskId = objTask
    Set objTimeTracking.UserId = ##class(User.Person).%OpenId(4)

    If obj.%IsDefined("StartTracking") {
        Set objTimeTracking.StartTracking = obj.StartTracking	
    }
    Else {
        Set objTimeTracking.StartTracking = $ZDatetime($Horolog,3)
    }

    If obj.%IsDefined("EndTracking") {
        Set objTimeTracking.EndTracking = obj.EndTracking	
    }

    Set tSC = objTimeTracking.%Save()

    Quit $$$OK
}

}
