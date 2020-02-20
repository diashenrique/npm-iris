Class diashenrique.npm.REST.Dispatch Extends %CSP.REST
{

XData UrlMap [ XMLNamespace = "http://www.intersystems.com/urlmap" ]
{
<Routes>

<Route Url="/" Method="GET" Call="Test" Cors="true"/>

<!-- .User -->
<Route Url="/user" Method="GET" Call="diashenrique.npm.REST.Routes.User:List" Cors="true"/>
<Route Url="/user" Method="POST" Call="diashenrique.npm.REST.Routes.User:NewUser" Cors="true"/>
<Route Url="/user/lookup" Method="GET" Call="diashenrique.npm.REST.Routes.User:Lookup" Cors="true"/>
<Route Url="/user/:id" Method="GET" Call="diashenrique.npm.REST.Routes.User:GetUser" Cors="true"/>
<Route Url="/user/:id" Method="PUT" Call="diashenrique.npm.REST.Routes.User:Update" Cors="true"/>
<Route Url="/user/:id" Method="DELETE" Call="diashenrique.npm.REST.Routes.User:Delete" Cors="true"/>
<!-- ./User -->

<!-- .Team -->
<Route Url="/team" Method="GET" Call="diashenrique.npm.REST.Routes.Team:List" Cors="true"/>
<Route Url="/team" Method="POST" Call="diashenrique.npm.REST.Routes.Team:NewTeam" Cors="true"/>
<Route Url="/team/:id" Method="GET" Call="diashenrique.npm.REST.Routes.Team:GetTeam" Cors="true"/>
<Route Url="/team/:id" Method="PUT" Call="diashenrique.npm.REST.Routes.Team:Update" Cors="true"/>
<Route Url="/team/:id" Method="DELETE" Call="diashenrique.npm.REST.Routes.Team:Delete" Cors="true"/>
<!-- ./Team -->

<!-- .Project -->
<Route Url="/project" Method="GET" Call="diashenrique.npm.REST.Routes.Project:List" Cors="true"/>
<Route Url="/project" Method="POST" Call="diashenrique.npm.REST.Routes.Project:NewProject" Cors="true"/>
<Route Url="/project/lookup" Method="GET" Call="diashenrique.npm.REST.Routes.Project:Lookup" Cors="true"/>
<Route Url="/project/:id" Method="GET" Call="diashenrique.npm.REST.Routes.Project:GetProject" Cors="true"/>
<Route Url="/project/:id" Method="PUT" Call="diashenrique.npm.REST.Routes.Project:Update" Cors="true"/>
<Route Url="/project/:id" Method="DELETE" Call="diashenrique.npm.REST.Routes.Project:Delete" Cors="true"/>
<!-- ./Project -->

<!-- .Calendar -->
<Route Url="/calendar" Method="GET" Call="diashenrique.npm.REST.Routes.Project:List" Cors="true"/>
<Route Url="/calendar" Method="POST" Call="diashenrique.npm.REST.Routes.Project:NewCalendar" Cors="true"/>
<Route Url="/calendar/:id" Method="GET" Call="diashenrique.npm.REST.Routes.Project:GetCalendar" Cors="true"/>
<Route Url="/calendar/:id" Method="PUT" Call="diashenrique.npm.REST.Routes.Project:Update" Cors="true"/>
<Route Url="/calendar/:id" Method="DELETE" Call="diashenrique.npm.REST.Routes.Project:Delete" Cors="true"/>
<!-- ./Calendar -->

<!-- .Scheduler -->
<Route Url="/scheduler" Method="GET" Call="diashenrique.npm.REST.Routes.Scheduler:List" Cors="true"/>
<Route Url="/scheduler" Method="POST" Call="diashenrique.npm.REST.Routes.Scheduler:NewScheduler" Cors="true"/>
<Route Url="/scheduler/:id" Method="GET" Call="diashenrique.npm.REST.Routes.Scheduler:GetScheduler" Cors="true"/>
<Route Url="/scheduler/:id" Method="PUT" Call="diashenrique.npm.REST.Routes.Scheduler:Update" Cors="true"/>
<Route Url="/scheduler/:id" Method="DELETE" Call="diashenrique.npm.REST.Routes.Scheduler:Delete" Cors="true"/>
<!-- ./Scheduler -->

<!-- .Task -->
<Route Url="/task" Method="GET" Call="diashenrique.npm.REST.Routes.Task:TreeList" Cors="true"/>
<Route Url="/task" Method="POST" Call="diashenrique.npm.REST.Routes.Task:NewTask" Cors="true"/>
<Route Url="/task/:id" Method="GET" Call="diashenrique.npm.REST.Routes.Task:GetTask" Cors="true"/>
<Route Url="/task/:id" Method="PUT" Call="diashenrique.npm.REST.Routes.Task:Update" Cors="true"/>
<Route Url="/task/:id" Method="DELETE" Call="diashenrique.npm.REST.Routes.Task:Delete" Cors="true"/>
<!-- ./Task -->

<!-- .Kanban --> 
<Route Url="/kanban" Method="GET" Call="diashenrique.npm.REST.Routes.Kanban:List" Cors="true"/>
<Route Url="/kanban" Method="POST" Call="diashenrique.npm.REST.Routes.Kanban:NewTask" Cors="true"/>
<Route Url="/kanban/:id" Method="GET" Call="diashenrique.npm.REST.Routes.Kanban:GetKanban" Cors="true"/>
<Route Url="/kanban/:id" Method="PUT" Call="diashenrique.npm.REST.Routes.Kanban:Update" Cors="true"/>
<!-- ./Kanban -->

<!-- .TimeTracking --> 
<Route Url="/timetracking" Method="GET" Call="diashenrique.npm.REST.Routes.TimeTracking:List" Cors="true"/>
<Route Url="/timetracking/:id" Method="POST" Call="diashenrique.npm.REST.Routes.TimeTracking:NewTimeTracking" Cors="true"/>
<Route Url="/timetracking/:id" Method="GET" Call="diashenrique.npm.REST.Routes.TimeTracking:GetTimeTrackingByTask" Cors="true"/>
<Route Url="/timetracking/:id" Method="PUT" Call="diashenrique.npm.REST.Routes.TimeTracking:Update" Cors="true"/>
<!-- ./TimeTracking -->

<!-- .Gantt --> 
<!-- ./Gantt Dependence-->
<Route Url="/gantt/dependence" Method="GET" Call="diashenrique.npm.REST.Routes.Gantt:Dependence" Cors="true"/>
<Route Url="/gantt/dependence" Method="POST" Call="diashenrique.npm.REST.Routes.Gantt:NewTaskDependence" Cors="true"/>
<Route Url="/gantt/resource" Method="GET" Call="diashenrique.npm.REST.Routes.Gantt:Resource" Cors="true"/>
<Route Url="/gantt/resourceAssignments" Method="GET" Call="diashenrique.npm.REST.Routes.Gantt:ResourceAssignment" Cors="true"/>

<Route Url="/gantt/dependence/:id" Method="GET" Call="diashenrique.npm.REST.Routes.Gantt:GetTaskDependence" Cors="true"/>
<Route Url="/gantt/dependence/:id" Method="PUT" Call="diashenrique.npm.REST.Routes.Gantt:UpdateDependence" Cors="true"/>
<Route Url="/gantt/dependence/:id" Method="DELETE" Call="diashenrique.npm.REST.Routes.Gantt:DeleteDependence" Cors="true"/>

<Route Url="/gantt/resource/:id" Method="PUT" Call="diashenrique.npm.REST.Routes.Gantt:UpdateResourceAssignment" Cors="true"/>

<Route Url="/gantt" Method="GET" Call="diashenrique.npm.REST.Routes.Gantt:List" Cors="true"/>
<Route Url="/gantt" Method="POST" Call="diashenrique.npm.REST.Routes.Gantt:NewTask" Cors="true"/>
<Route Url="/gantt/:id" Method="GET" Call="diashenrique.npm.REST.Routes.Gantt:GetTask" Cors="true"/>
<Route Url="/gantt/:id" Method="PUT" Call="diashenrique.npm.REST.Routes.Gantt:Update" Cors="true"/>
<Route Url="/gantt/:id" Method="DELETE" Call="diashenrique.npm.REST.Routes.Gantt:Delete" Cors="true"/>
<!-- ./Gantt -->
</Routes>
}

ClassMethod Test() As %Status
{
	Set %response.ContentType = "application/json"
	Set retObj = { }
	Set retMessage = "Hello World!"
	Set retObj.Message = retMessage
	Write retObj.%ToJSON()
	Quit $$$OK
}

}
