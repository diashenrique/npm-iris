Class diashenrique.npm.REST.Routes.Task Extends %CSP.REST
{

ClassMethod TreeList() As %Status
{
    Set %response.ContentType = "application/json"

    Set tSC = $System.Status.OK()
    Set arrayTask = []
    Set dynamicTask = { }

    Try {

        Set oRS = ##class(%SQL.Statement).%New()

        Set sql = "SELECT ID, TaskName, TO_Number(Estimate) As Estimate, %EXTERNAL(StartDate) As StartDate, %EXTERNAL(DueDate) As DueDate, Priority, Status, Progress, "_
                "TO_NUMBER(AssignedUser) As AssignedUser, NVL(ParentId,0) as ParentId, TO_NUMBER(ProjectId) As ProjectId FROM diashenrique_npm_Data.Task"

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

    Do dynamicTask.%Set("data",arrayTask)

    Write dynamicTask.%ToJSON() 

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

    Set iter = obj.%GetIterator()
    While iter.%GetNext(.key , .value )  {
        Set ^zHGD($ZName,"Update",key) = value
        If ((key = "StartDate") || (key = "DueDate")) {
            Set $Property(objTask, key) = $ZDateh($Replace(value,"/",""),8)
        }
        ElseIf (key = "AssignedUser") {
            Set $Property(objTask, key) = ##class(diashenrique.npm.Data.Person).%OpenId(value) 
        }	 
        ElseIf (key = "ParentId") {
            Set $Property(objTask, key) = ##class(diashenrique.npm.Data.Task).%OpenId(value)
        }	 
        ElseIf (key = "ProjectId") {
            Set $Property(objTask, key) = ##class(diashenrique.npm.Data.Project).%OpenId(value)
        }
        ElseIf (key = "Estimate") {
            Set $Property(objTask, key) = value
            Set beginDate = $Extract(objTask.StartDate,1,10)
            Set objTask.DueDate = ##class(diashenrique.npm.util.TimeTracking).calcEndDateTask(objTask.ProjectId.%Id(),beginDate,value)
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

ClassMethod Delete(id As %Integer) As %Status
{
    If '##class(diashenrique.npm.Data.Task).%ExistsId(id) {
        Set %responde.Status = ..#HTTP404NOTFOUND
        Quit $$$OK	
    }

    Do ##class(diashenrique.npm.Data.Task).%DeleteId(id)

    Quit $$$OK
}

ClassMethod NewTask() As %Status
{
    #dim task As diashenrique.npm.Data.Task

    Set obj = ##class(%DynamicAbstractObject).%FromJSON(%request.Content)

    Set objTask = ##class(diashenrique.npm.Data.Task).%New()

    Set objTask.TaskName = obj.TaskName
    Set objTask.Estimate = obj.Estimate

    Set beginDate = $Extract(obj.StartDate,1,10)
    Set objTask.StartDate = beginDate_" 09:00:00"
    Set objTask.DueDate = ##class(diashenrique.npm.util.TimeTracking).calcEndDateTask(obj.ProjectId,obj.StartDate,obj.Estimate)
    Set objTask.Progress = obj.Progress
    Set objTask.Priority = obj.Priority
    Set objTask.Status = obj.Status
    Set objTask.AssignedUser = ##class(diashenrique.npm.Data.Person).%OpenId(obj.AssignedUser)
    Set objTask.ParentId = ##class(diashenrique.npm.Data.Task).%OpenId(obj.ParentId)
    Set objTask.ProjectId = ##class(diashenrique.npm.Data.Project).%OpenId(obj.ProjectId)
    ;set objTask.PredecessorId = obj.PredecessorId
    ;set objTask.SucessorId = obj.SucessorId

    Set tSC = objTask.%Save()

    Quit tSC
}

ClassMethod GetTask(id As %Integer) As %Status
{

    Set %response.ContentType = "application/json"

    Set objTask = ##class(diashenrique.npm.Data.Task).%OpenId(id)
    Set obj = { }

    Do obj.%Set("id", objTask.%Id())
    Do obj.%Set("TaskName", objTask.TaskName)
    Do obj.%Set("Estimate", objTask.Estimate)
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

}
