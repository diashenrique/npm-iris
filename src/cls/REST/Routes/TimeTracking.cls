Class REST.Routes.TimeTracking Extends %CSP.REST
{

ClassMethod List() As %Status
{
    set %response.ContentType = "application/json"

    set tSC = $system.Status.OK()
    set arrayTask = []
    set dynamicTask = {}

    try {

        set oRS = ##class(%SQL.Statement).%New()

        set sql = "SELECT ID, AssignedUser, TaskName, TO_CHAR(StartDate,'YYYY/MM/DD') As StartDate, TO_CHAR(DueDate,'YYYY/MM/DD') As DueDate, Status, Priority, Progress, %EXTERNAL(TrackingStatus) As TrackingStatus, ParentId FROM SQLUser.Task"

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
    set obj = {}.%FromJSON(%request.Content)

    if (id = "") {
        set %response.Status = ..#HTTP404NOTFOUND
        quit $$$OK
    }

    set idTimeTracking = ""

    &SQL(SELECT ID INTO :idTimeTracking FROM SQLUser.TimeTracking WHERE TaskId = :id AND UserId = 4 AND EndTracking IS NULL)

    set objTimeTracking = ##class(User.TimeTracking).%OpenId(idTimeTracking)

    set objTimeTracking.EndTracking = $zdatetime($horolog,3)

    set tSC = objTimeTracking.%Save()

    if $$$ISERR(tSC) {
        quit $system.OBJ.DisplayError(tSC)
    }

    quit $$$OK
}

ClassMethod GetTimeTrackingByTask(id As %Integer) As %Status
{
    set %response.ContentType = "application/json"

    set strTotalTime = ##class(Util.TimeTracking).GetTotalTimeByTask(id)

    set obj = {} 

    do obj.%Set("totalTime",strTotalTime)

    write obj.%ToJSON() 

    quit $$$OK
}

ClassMethod NewTimeTracking(pTaskId As %Integer) As %Status
{
    set obj = ##class(%DynamicObject).%FromJSON(%request.Content)

    set objTask = ##class(User.Task).%OpenId(pTaskId)

    if '$isobject(objTask) {
        set %response.Status = ..#HTTP404NOTFOUND
        quit $$$OK
    }

    set objTimeTracking = ##class(User.TimeTracking).%New()

    set objTimeTracking.TaskId = objTask
    set objTimeTracking.UserId = ##class(User.Person).%OpenId(4)

    if obj.%IsDefined("StartTracking") {
        set objTimeTracking.StartTracking = obj.StartTracking	
    }
    else {
        set objTimeTracking.StartTracking = $zdatetime($horolog,3)
    }

    if obj.%IsDefined("EndTracking") {
        set objTimeTracking.EndTracking = obj.EndTracking	
    }

    set tSC = objTimeTracking.%Save()

    quit $$$OK
}

}
