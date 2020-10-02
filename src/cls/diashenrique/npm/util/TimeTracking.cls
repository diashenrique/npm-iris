Class diashenrique.npm.util.TimeTracking
{

ClassMethod GetTotalTimeByTask(pTaskId) As %Integer
{
    Set TotalTime = ""

    &SQL(SELECT SUM({fn TIMESTAMPDIFF(SQL_TSI_SECOND, StartTracking, EndTracking)}) as Seconds INTO :TotalTime FROM diashenrique_npm_Data.TimeTracking WHERE TaskId = :pTaskId GROUP BY TaskId)

    Quit ..CalcTimeConsumed(TotalTime)
}

ClassMethod CalcTimeConsumed(pTotalSeconds As %Integer) As %String
{
    Set strTotalTime = "0h 0min"

    If (pTotalSeconds = "") {
        Quit strTotalTime
    }

    Set hour = $Piece((pTotalSeconds / 3600),".")
    Set minute = $Piece((pTotalSeconds / 60 # 60),".")
    ;set second = $Piece((pTotalSeconds # 60),".")
    Set strTotalTime = hour_"h "_minute_"min"

    Quit strTotalTime
}

ClassMethod calcEndDateTask(pProjectId, pDate As %Date, pEstimateHour As %Integer) As %TimeStamp
{
    Set (objProject, tDailyHours, estimateDays, estimateHour, dayHorolog) = ""
    Set startingHour = 9    // Assuming 9AM as starting time 
    
    // Get Daily Hour for the Specific Project
    Set objProject = ##class(diashenrique.npm.Data.Project).%OpenId(pProjectId)
    Set tDailyHours = objProject.DailyHours
    
    If (pEstimateHour > tDailyHours) {
        Set estimateDays = pEstimateHour\tDailyHours
        Set estimateHour = (startingHour + pEstimateHour#tDailyHours) * 3600
    }
    Else {
        Set estimateHour = (startingHour + pEstimateHour) * 3600
    }
    
    Set dayHorolog = $ZDateh(pDate,8) + estimateDays
    Set finalDate = $ZDatetime(dayHorolog_","_estimateHour,3)

    Quit finalDate
}

}
