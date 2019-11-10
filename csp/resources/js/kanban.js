var urlOrigin = window.location.origin;
var urlREST = urlOrigin + "/npm/rest";

var tasks, idTask, newStatus;

$(function() {
  var taskStore = new DevExpress.data.CustomStore({
    key: "ID",
    load: function() {
      return $.getJSON(urlREST + "/task");
    },
    insert: function(values) {
      return $.ajax({
        url: urlREST + "/task",
        method: "POST",
        processData: false,
        contentType: "application/json",
        data: JSON.stringify(values)
      });
    },
    onBeforeSend: function(method, ajaxOptions) {
      ajaxOptions.xhrFields = { withCredentials: true };
    }
  });

  var lookupDataSource = {
    store: new DevExpress.data.CustomStore({
      key: "ID",
      loadMode: "raw",
      load: function() {
        return $.getJSON(urlREST + "/user/lookup");
      }
    }),
    sort: "UserName"
  };

  var lookupProject = {
    store: new DevExpress.data.CustomStore({
      key: "ID",
      loadMode: "raw",
      load: function() {
        return $.getJSON(urlREST + "/project/lookup");
      }
    }),
    sort: "code"
  };

  // Popup to create new tasks
  var popup = null;
  var popupOptions = {
    width: 600,
    height: 420,
    contentTemplate: function(e) {
      var formContainer = $("<div id='formPopup'>");
      formContainer
        .dxForm({
          dataSource: taskStore,
          readOnly: false,
          showColonAfterLabel: false,
          labelLocation: "top",
          minColWidth: 300,
          showValidationSummary: true,
          colCount: 2,
          items: [
            {
              dataField: "Project",
              editorType: "dxSelectBox",
              lookup: {
                dataSource: lookupProject,
                valueExpr: "ID",
                displayExpr: "code"
              }
            },
            {
              dataField: "TaskName"
            },
            {
              dataField: "StartDate",
              dataType: "date",
              editorType: "dxDateBox"
            },
            {
              dataField: "DueDate",
              dataType: "date",
              editorType: "dxDateBox"
            },
            {
              dataField: "Progress",
              editorType: "dxSlider",
              editorOptions: {
                min: 0,
                max: 100,
                value: 0,
                rtlEnabled: false,
                tooltip: {
                  enabled: true,
                  format: function(value) {
                    return value + "%";
                  },
                  showMode: "onHover",
                  position: "bottom"
                }
              }
            },
            {
              dataField: "Priority",
              editorType: "dxSelectBox",
              editorOptions: {
                dataSource: [
                  {
                    id: 1,
                    name: "Normal"
                  },
                  {
                    id: 2,
                    name: "Low"
                  },
                  {
                    id: 3,
                    name: "Medium"
                  },
                  {
                    id: 4,
                    name: "High"
                  }
                ],
                valueExpr: "name",
                displayExpr: "name"
              }
            },
            {
              dataField: "Status",
              editorType: "dxSelectBox",
              editorOptions: {
                dataSource: [
                  {
                    id: 1,
                    name: "Not Started"
                  },
                  {
                    id: 2,
                    name: "In Progress"
                  },
                  {
                    id: 3,
                    name: "Deferred"
                  },
                  {
                    id: 4,
                    name: "Need Assistance"
                  },
                  {
                    id: 5,
                    name: "Completed"
                  }
                ],
                valueExpr: "name",
                displayExpr: "name"
              }
            },
            {
              dataField: "AssignedUser",
              editorType: "dxSelectBox",
              lookup: {
                dataSource: lookupDataSource,
                valueExpr: "ID",
                displayExpr: "UserName"
              }
            },
            {
              itemType: "button",
              colSpan: 2,
              horizontalAlignment: "right",
              buttonOptions: {
                text: "Register",
                type: "success",
                onClick: function() {
                  var dataForm = $("#formPopup")
                    .dxForm("instance")
                    .option("formData");

                  $.ajax({
                    url: urlREST + "/kanban",
                    method: "POST",
                    processData: false,
                    contentType: "application/json",
                    data: JSON.stringify(dataForm)
                  }).done(function(msg) {
                    DevExpress.ui.notify("The Outlined button was clicked");
                  });

                  $(".popup").remove();
                }
              }
            }
          ]
        })
        .dxForm("instance");
      e.append(formContainer);
    },
    showTitle: true,
    title: "Add Task",
    visible: false,
    dragEnabled: true,
    closeOnOutsideClick: false
  };

  var showPopup = function(data) {
    if (popup) {
      $(".popup").remove();
    }
    var $popupContainer = $("<div />")
      .addClass("popup")
      .appendTo($("#popup"));
    popup = $popupContainer.dxPopup(popupOptions).dxPopup("instance");
    popup.show();
  };

  // Button Add Task
  $("#btnAddTask").dxButton({
    icon: "fas fa-tasks",
    hint: "Add Task",
    onClick: function(e) {
      showPopup();
    }
  });
  // Button Expand Page
  $("#btnExpandPage").dxButton({
    icon: "fas fa-expand-arrows-alt",
    hint: "Expange Page"
  });

  // Script to render Kanban cards and lists
  var retTasks = $.getJSON(urlREST + "/kanban")
    .done(function() {
      var tasks = retTasks.responseJSON;
      var statuses = ["Not Started", "Need Assistance", "In Progress", "Deferred", "Completed"];

      renderKanban($("#kanban"), statuses);

      function renderKanban($container, statuses) {
        statuses.forEach(function(status) {
          renderList($container, status);
        });

        $container.addClass("scrollable-board").dxScrollView({
          direction: "horizontal",
          showScrollbar: "always"
        });
      }

      function renderList($container, status) {
        var $list = $("<div>")
          .addClass("list")
          .appendTo($container);

        renderListTitle($list, status);

        var listTasks = tasks.filter(function(task) {
          return task.Status === status;
        });

        renderCards($list, listTasks);
      }

      function renderListTitle($container, status) {
        $("<div>")
          .addClass("list-title")
          .addClass("dx-theme-text-color")
          .text(status)
          .appendTo($container);
      }

      function renderCards($container, tasks) {
        var $scroll = $("<div>").appendTo($container);
        var $items = $("<div>").appendTo($scroll);

        tasks.forEach(function(task) {
          renderCard($items, task);
        });

        $scroll.addClass("scrollable-list").dxScrollView({
          direction: "vertical",
          showScrollbar: "always"
        });

        $items.addClass("sortable-cards").dxSortable({
          group: "tasksGroup",
          moveItemOnDrop: true,
          onDragEnd: function(info) {
            idTask = info.itemElement[0].id;
            newStatus = info.toComponent._$element[0].offsetParent.parentElement.parentElement.parentElement.previousElementSibling.outerText;

            $.ajax({
              url: urlREST + "/kanban/" + idTask,
              method: "PUT",
              processData: false,
              contentType: "application/json",
              data: JSON.stringify({ Status: newStatus })
            }).done(function(msg) {
              //alert("Data Saved: " + msg);
            });
          }
        });
      }

      function renderCard($container, task) {
        var $item = $("<div>")
          .attr("id", task.ID)
          .addClass("card")
          .addClass("dx-card")
          .addClass("dx-theme-text-color")
          .addClass("dx-theme-background-color")
          .bind({
            click: function() {
              // TODO: Adapt function to open popup form with specific values
              showPopup();
            }
          })
          .appendTo($container);

        var user = users.filter(function(user) {
          return user.ID === task.AssignedUser;
        })[0];

        $("<div>")
          .addClass("card-priority")
          .addClass(task.Priority)
          .appendTo($item);
        $("<div>")
          .addClass("card-subject")
          .text(task.TaskName)
          .appendTo($item);
        $("<div>")
          .addClass("card-assignee")
          .html("<i class='far fa-clock'></i> " + task.DueDate)
          .appendTo($item);
        $("<div>")
          .addClass("card-assignee")
          .text(user.UserName)
          .appendTo($item);
      }
    })
    .fail(function() {
      console.log("error");
    });
});

var users = [
  {
    ID: "4",
    UserName: "diashenrique",
    Name: "Henrique Dias",
    email: "henrique@gmail.com",
    DateOfBirth: "02/10/1984",
    JobTitle: "CTO",
    Company: "Nishimura CO",
    ProfileHeading: "Craaazy",
    PhotoProfile: "B5924",
    Active: 1,
    Password: "I6226"
  },
  {
    ID: "7",
    UserName: "ninaroberson",
    Name: "Darren Barker",
    email: "jorgetrevino@yahoo.com",
    DateOfBirth: "10/19/2019",
    JobTitle: "Analyst Dynamic",
    Company: "Utilities",
    ProfileHeading: "Fast learner",
    PhotoProfile: "F8728",
    Active: 0,
    Password: "N6600"
  },
  {
    ID: "9",
    UserName: "ruben_perry",
    Name: "Benjamin Gibbs",
    email: "jimmiemoran83@gmail.com",
    DateOfBirth: "12/29/2018",
    JobTitle: "Director  Legal Internal",
    Company: "Cosmetics",
    ProfileHeading: "Leadership",
    PhotoProfile: "G3775",
    Active: 1,
    Password: "Y770"
  },
  {
    ID: "10",
    UserName: "donbarber",
    Name: "Claudia Spencer Ballard",
    email: "marlene_george21@yahoo.com",
    DateOfBirth: "10/31/2018",
    JobTitle: "Executive  Banking Lead",
    Company: "Alternative Dispute Resolution",
    ProfileHeading: "Teamwork",
    PhotoProfile: "V491",
    Active: 1,
    Password: "E7051"
  },
  {
    ID: "11",
    UserName: "lawrence53",
    Name: "Ivan Hodge",
    email: "tracy.wiley39@yahoo.com",
    DateOfBirth: "06/11/2019",
    JobTitle: "Developer  Retail",
    Company: "Farming",
    ProfileHeading: "Work under pressure",
    PhotoProfile: "Z6670",
    Active: 0,
    Password: "N6971"
  },
  {
    ID: "12",
    UserName: "timsilva67",
    Name: "Nicholas Lambert",
    email: "nataliedean@gmail.com",
    DateOfBirth: "10/27/2018",
    JobTitle: "Planner  Farming",
    Company: "Restaurants",
    ProfileHeading: "Work under pressure",
    PhotoProfile: "M9752",
    Active: 1,
    Password: "T8208"
  },
  {
    ID: "13",
    UserName: "russell.reed",
    Name: "Hilda Nguyen",
    email: "connie_sutton92@hotmail.com",
    DateOfBirth: "12/24/2018",
    JobTitle: "Supervisor  Education",
    Company: " Travel & Tourism",
    ProfileHeading: "Fast learner",
    PhotoProfile: "Q5997",
    Active: 0,
    Password: "Y4561"
  },
  {
    ID: "14",
    UserName: "katherineclark43",
    Name: "Daisy Cameron Saunders Lang",
    email: "rebecca.greene@yahoo.com",
    DateOfBirth: "12/26/2018",
    JobTitle: "Assistant  Marketing Corporate",
    Company: "Health",
    ProfileHeading: "Fast learner",
    PhotoProfile: "C8338",
    Active: 0,
    Password: "U3860"
  },
  {
    ID: "15",
    UserName: "megan.owen34",
    Name: "Penny Buchanan Montoya Hartman",
    email: "kim.davis34@gmail.com",
    DateOfBirth: "01/29/2019",
    JobTitle: "Facilitator  Real-Estate",
    Company: "Security and Investigations",
    ProfileHeading: "Work under pressure",
    PhotoProfile: "X8101",
    Active: 1,
    Password: "T8232"
  },
  {
    ID: "16",
    UserName: "derek_saunders",
    Name: "Victoria Young",
    email: "kathryn_hale38@hotmail.com",
    DateOfBirth: "02/10/2019",
    JobTitle: "Executive Direct",
    Company: "Entertainment",
    ProfileHeading: "Self-motivated",
    PhotoProfile: "V6067",
    Active: 0,
    Password: "C5218"
  },
  {
    ID: "17",
    UserName: "carla_parrish66",
    Name: "Maria Goodwin Fowler",
    email: "danielfletcher@yahoo.com",
    DateOfBirth: "03/23/2019",
    JobTitle: "Producer  Marketing Dynamic",
    Company: "Judiciary",
    ProfileHeading: "Work under pressure",
    PhotoProfile: "H6302",
    Active: 0,
    Password: "R2127"
  },
  {
    ID: "18",
    UserName: "ross54",
    Name: "Hector Newman",
    email: "marjorie_patel@gmail.com",
    DateOfBirth: "06/10/2019",
    JobTitle: "Engineer  Sales",
    Company: "Medical Devices",
    ProfileHeading: "Technical savvy",
    PhotoProfile: "W6274",
    Active: 0,
    Password: "J5791"
  },
  {
    ID: "19",
    UserName: "waynewilliams27",
    Name: "Holly Shelton Reynolds Fields",
    email: "jason35@yahoo.com",
    DateOfBirth: "03/26/2019",
    JobTitle: "Facilitator  Technology Legacy",
    Company: "Sports",
    ProfileHeading: "Networking skills",
    PhotoProfile: "R6818",
    Active: 0,
    Password: "B9174"
  },
  {
    ID: "25",
    UserName: "danieljun",
    Name: "Daniel Jun Nakata Goncalves Dias",
    email: "daniel.nakata.dias@gmail.com",
    DateOfBirth: "06/23/2012",
    JobTitle: "Tech Genius",
    Company: "Nishimura Co",
    ProfileHeading: "",
    PhotoProfile: "",
    Active: 1,
    Password: ""
  }
];

var tasksOld = [
  {
    Task_ID: 1,
    Task_Assigned_Employee_ID: 1,
    Task_Owner_ID: 1,
    Task_Subject: "Plans 2015",
    Task_Start_Date: "2015-01-01T00:00:00",
    Task_Due_Date: "2015-04-01T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 4,
    Task_Completion: 100,
    Task_Parent_ID: 0
  },
  {
    Task_ID: 2,
    Task_Assigned_Employee_ID: 2,
    Task_Owner_ID: 1,
    Task_Subject: "Health Insurance",
    Task_Start_Date: "2015-02-12T00:00:00",
    Task_Due_Date: "2015-05-30T00:00:00",
    Task_Status: "In Progress",
    Task_Priority: 4,
    Task_Completion: 75,
    Task_Parent_ID: 0
  },
  {
    Task_ID: 3,
    Task_Assigned_Employee_ID: 4,
    Task_Owner_ID: 4,
    Task_Subject: "New Brochures",
    Task_Start_Date: "2015-02-17T00:00:00",
    Task_Due_Date: "2015-03-01T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 3,
    Task_Completion: 100,
    Task_Parent_ID: 0
  },
  {
    Task_ID: 4,
    Task_Assigned_Employee_ID: 31,
    Task_Owner_ID: 33,
    Task_Subject: "Training",
    Task_Start_Date: "2015-03-02T00:00:00",
    Task_Due_Date: "2015-06-29T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 3,
    Task_Completion: 100,
    Task_Parent_ID: 0
  },
  {
    Task_ID: 5,
    Task_Assigned_Employee_ID: 5,
    Task_Owner_ID: 5,
    Task_Subject: "NDA",
    Task_Start_Date: "2015-03-12T00:00:00",
    Task_Due_Date: "2015-05-01T00:00:00",
    Task_Status: "In Progress",
    Task_Priority: 3,
    Task_Completion: 90,
    Task_Parent_ID: 0
  },
  {
    Task_ID: 6,
    Task_Assigned_Employee_ID: 7,
    Task_Owner_ID: 1,
    Task_Subject: "Revenue Projections",
    Task_Start_Date: "2015-03-24T00:00:00",
    Task_Due_Date: "2015-04-15T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 3,
    Task_Completion: 100,
    Task_Parent_ID: 0
  },
  {
    Task_ID: 7,
    Task_Assigned_Employee_ID: 9,
    Task_Owner_ID: 9,
    Task_Subject: "TV Recall",
    Task_Start_Date: "2015-04-18T00:00:00",
    Task_Due_Date: "2016-02-04T00:00:00",
    Task_Status: "In Progress",
    Task_Priority: 4,
    Task_Completion: 90,
    Task_Parent_ID: 0
  },
  {
    Task_ID: 8,
    Task_Assigned_Employee_ID: 6,
    Task_Owner_ID: 5,
    Task_Subject: "Overtime",
    Task_Start_Date: "2015-06-10T00:00:00",
    Task_Due_Date: "2015-06-20T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 0
  },
  {
    Task_ID: 9,
    Task_Assigned_Employee_ID: 8,
    Task_Owner_ID: 12,
    Task_Subject: "Recall and Refund Forms",
    Task_Start_Date: "2015-06-17T00:00:00",
    Task_Due_Date: "2016-04-09T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 0
  },
  {
    Task_ID: 10,
    Task_Assigned_Employee_ID: 10,
    Task_Owner_ID: 8,
    Task_Subject: "Shippers",
    Task_Start_Date: "2015-07-10T00:00:00",
    Task_Due_Date: "2016-04-11T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 0
  },
  {
    Task_ID: 11,
    Task_Assigned_Employee_ID: 6,
    Task_Owner_ID: 22,
    Task_Subject: "Hardware Upgrade",
    Task_Start_Date: "2015-07-22T00:00:00",
    Task_Due_Date: "2016-05-01T00:00:00",
    Task_Status: "In Progress",
    Task_Priority: 3,
    Task_Completion: 95,
    Task_Parent_ID: 0
  },
  {
    Task_ID: 12,
    Task_Assigned_Employee_ID: 6,
    Task_Owner_ID: 24,
    Task_Subject: "Touch-Enabled Apps",
    Task_Start_Date: "2015-08-05T00:00:00",
    Task_Due_Date: "2016-04-30T00:00:00",
    Task_Status: "In Progress",
    Task_Priority: 2,
    Task_Completion: 90,
    Task_Parent_ID: 0
  },
  {
    Task_ID: 13,
    Task_Assigned_Employee_ID: 6,
    Task_Owner_ID: 6,
    Task_Subject: "Online Sales",
    Task_Start_Date: "2015-08-20T00:00:00",
    Task_Due_Date: "2015-09-15T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 4,
    Task_Completion: 100,
    Task_Parent_ID: 0
  },
  {
    Task_ID: 14,
    Task_Assigned_Employee_ID: 6,
    Task_Owner_ID: 8,
    Task_Subject: "New Website Design",
    Task_Start_Date: "2015-09-17T00:00:00",
    Task_Due_Date: "2015-11-01T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 4,
    Task_Completion: 100,
    Task_Parent_ID: 0
  },
  {
    Task_ID: 15,
    Task_Assigned_Employee_ID: 6,
    Task_Owner_ID: 22,
    Task_Subject: "Bandwidth Increase",
    Task_Start_Date: "2015-11-01T00:00:00",
    Task_Due_Date: "2015-11-07T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 3,
    Task_Completion: 100,
    Task_Parent_ID: 0
  },
  {
    Task_ID: 16,
    Task_Assigned_Employee_ID: 18,
    Task_Owner_ID: 9,
    Task_Subject: "Support",
    Task_Start_Date: "2015-11-10T00:00:00",
    Task_Due_Date: "2015-11-15T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 0
  },
  {
    Task_ID: 17,
    Task_Assigned_Employee_ID: 31,
    Task_Owner_ID: 31,
    Task_Subject: "Training Material",
    Task_Start_Date: "2015-11-14T00:00:00",
    Task_Due_Date: "2016-02-05T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 3,
    Task_Completion: 100,
    Task_Parent_ID: 0
  },
  {
    Task_ID: 18,
    Task_Assigned_Employee_ID: 22,
    Task_Owner_ID: 3,
    Task_Subject: "New Database",
    Task_Start_Date: "2015-12-24T00:00:00",
    Task_Due_Date: "2015-12-29T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 4,
    Task_Completion: 95,
    Task_Parent_ID: 0
  },
  {
    Task_ID: 19,
    Task_Assigned_Employee_ID: 32,
    Task_Owner_ID: 3,
    Task_Subject: "New HDMI Specification",
    Task_Start_Date: "2016-01-02T00:00:00",
    Task_Due_Date: "2016-01-31T00:00:00",
    Task_Status: "Deferred",
    Task_Priority: 2,
    Task_Completion: 50,
    Task_Parent_ID: 0
  },
  {
    Task_ID: 20,
    Task_Assigned_Employee_ID: 3,
    Task_Owner_ID: 3,
    Task_Subject: "Automation Server",
    Task_Start_Date: "2016-01-15T00:00:00",
    Task_Due_Date: "2016-04-30T00:00:00",
    Task_Status: "In Progress",
    Task_Priority: 3,
    Task_Completion: 85,
    Task_Parent_ID: 0
  },
  {
    Task_ID: 21,
    Task_Assigned_Employee_ID: 40,
    Task_Owner_ID: 8,
    Task_Subject: "Retail Sales",
    Task_Start_Date: "2016-01-20T00:00:00",
    Task_Due_Date: "2016-02-10T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 4,
    Task_Completion: 100,
    Task_Parent_ID: 0
  },
  {
    Task_ID: 22,
    Task_Assigned_Employee_ID: 1,
    Task_Owner_ID: 1,
    Task_Subject: "Reports",
    Task_Start_Date: "2016-03-13T00:00:00",
    Task_Due_Date: "2016-05-07T00:00:00",
    Task_Status: "In Progress",
    Task_Priority: 4,
    Task_Completion: 50,
    Task_Parent_ID: 0
  },
  {
    Task_ID: 23,
    Task_Assigned_Employee_ID: 5,
    Task_Owner_ID: 1,
    Task_Subject: "Budget",
    Task_Start_Date: "2016-03-20T00:00:00",
    Task_Due_Date: "2016-04-01T00:00:00",
    Task_Status: "In Progress",
    Task_Priority: 4,
    Task_Completion: 30,
    Task_Parent_ID: 0
  },
  {
    Task_ID: 24,
    Task_Assigned_Employee_ID: 13,
    Task_Owner_ID: 10,
    Task_Subject: "Shipping Labels",
    Task_Start_Date: "2016-04-01T00:00:00",
    Task_Due_Date: "2016-04-15T00:00:00",
    Task_Status: "In Progress",
    Task_Priority: 2,
    Task_Completion: 50,
    Task_Parent_ID: 0
  },
  {
    Task_ID: 25,
    Task_Assigned_Employee_ID: 10,
    Task_Owner_ID: 10,
    Task_Subject: "New Warehouse",
    Task_Start_Date: "2016-04-05T00:00:00",
    Task_Due_Date: "2016-04-15T00:00:00",
    Task_Status: "In Progress",
    Task_Priority: 2,
    Task_Completion: 65,
    Task_Parent_ID: 0
  },
  {
    Task_ID: 26,
    Task_Assigned_Employee_ID: 10,
    Task_Owner_ID: 10,
    Task_Subject: "Forklift",
    Task_Start_Date: "2016-04-07T00:00:00",
    Task_Due_Date: "2016-04-20T00:00:00",
    Task_Status: "In Progress",
    Task_Priority: 2,
    Task_Completion: 20,
    Task_Parent_ID: 0
  },
  {
    Task_ID: 27,
    Task_Assigned_Employee_ID: 1,
    Task_Owner_ID: 30,
    Task_Subject: "Customer Follow Up Plan",
    Task_Start_Date: "2016-05-05T00:00:00",
    Task_Due_Date: "2016-05-11T00:00:00",
    Task_Status: "In Progress",
    Task_Priority: 2,
    Task_Completion: 40,
    Task_Parent_ID: 0
  },
  {
    Task_ID: 28,
    Task_Assigned_Employee_ID: 7,
    Task_Owner_ID: 1,
    Task_Subject: "Prepare 2015 Financial",
    Task_Start_Date: "2015-01-15T00:00:00",
    Task_Due_Date: "2015-01-31T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 4,
    Task_Completion: 100,
    Task_Parent_ID: 1
  },
  {
    Task_ID: 29,
    Task_Assigned_Employee_ID: 4,
    Task_Owner_ID: 1,
    Task_Subject: "Prepare 2015 Marketing Plan",
    Task_Start_Date: "2015-01-01T00:00:00",
    Task_Due_Date: "2015-01-31T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 4,
    Task_Completion: 100,
    Task_Parent_ID: 1
  },
  {
    Task_ID: 30,
    Task_Assigned_Employee_ID: 2,
    Task_Owner_ID: 1,
    Task_Subject: "Review Health Insurance Options Under the Affordable Care Act",
    Task_Start_Date: "2015-02-12T00:00:00",
    Task_Due_Date: "2015-04-25T00:00:00",
    Task_Status: "In Progress",
    Task_Priority: 4,
    Task_Completion: 50,
    Task_Parent_ID: 2
  },
  {
    Task_ID: 31,
    Task_Assigned_Employee_ID: 1,
    Task_Owner_ID: 2,
    Task_Subject: "Choose between PPO and HMO Health Plan",
    Task_Start_Date: "2015-02-15T00:00:00",
    Task_Due_Date: "2015-04-15T00:00:00",
    Task_Status: "In Progress",
    Task_Priority: 4,
    Task_Completion: 75,
    Task_Parent_ID: 2
  },
  {
    Task_ID: 32,
    Task_Assigned_Employee_ID: 1,
    Task_Owner_ID: 4,
    Task_Subject: "Google AdWords Strategy",
    Task_Start_Date: "2015-02-16T00:00:00",
    Task_Due_Date: "2015-02-28T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 4,
    Task_Completion: 100,
    Task_Parent_ID: 29
  },
  {
    Task_ID: 34,
    Task_Assigned_Employee_ID: 28,
    Task_Owner_ID: 1,
    Task_Subject: "2015 Brochure Designs",
    Task_Start_Date: "2015-02-19T00:00:00",
    Task_Due_Date: "2015-02-24T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 3,
    Task_Completion: 100,
    Task_Parent_ID: 3
  },
  {
    Task_ID: 35,
    Task_Assigned_Employee_ID: 29,
    Task_Owner_ID: 28,
    Task_Subject: "Brochure Design Review",
    Task_Start_Date: "2015-02-19T00:00:00",
    Task_Due_Date: "2015-02-22T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 34
  },
  {
    Task_ID: 36,
    Task_Assigned_Employee_ID: 29,
    Task_Owner_ID: 28,
    Task_Subject: "Website Re-Design Plan",
    Task_Start_Date: "2015-02-19T00:00:00",
    Task_Due_Date: "2015-02-24T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 4,
    Task_Completion: 100,
    Task_Parent_ID: 34
  },
  {
    Task_ID: 37,
    Task_Assigned_Employee_ID: 4,
    Task_Owner_ID: 1,
    Task_Subject: "Rollout of New Website and Marketing Brochures",
    Task_Start_Date: "2015-02-20T00:00:00",
    Task_Due_Date: "2015-02-28T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 4,
    Task_Completion: 100,
    Task_Parent_ID: 3
  },
  {
    Task_ID: 38,
    Task_Assigned_Employee_ID: 8,
    Task_Owner_ID: 4,
    Task_Subject: "Update Sales Strategy Documents",
    Task_Start_Date: "2015-02-20T00:00:00",
    Task_Due_Date: "2015-02-22T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 29
  },
  {
    Task_ID: 39,
    Task_Assigned_Employee_ID: 41,
    Task_Owner_ID: 8,
    Task_Subject: "Create 2012 Sales Report",
    Task_Start_Date: "2015-02-20T00:00:00",
    Task_Due_Date: "2015-02-21T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 29
  },
  {
    Task_ID: 40,
    Task_Assigned_Employee_ID: 42,
    Task_Owner_ID: 41,
    Task_Subject: "Direct vs Online Sales Comparison Report",
    Task_Start_Date: "2015-02-20T00:00:00",
    Task_Due_Date: "2015-02-22T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 4,
    Task_Completion: 100,
    Task_Parent_ID: 29
  },
  {
    Task_ID: 41,
    Task_Assigned_Employee_ID: 4,
    Task_Owner_ID: 41,
    Task_Subject: "Review 2012 Sales Report and Approve 2015 Plans",
    Task_Start_Date: "2015-02-23T00:00:00",
    Task_Due_Date: "2015-02-28T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 29
  },
  {
    Task_ID: 42,
    Task_Assigned_Employee_ID: 3,
    Task_Owner_ID: 1,
    Task_Subject: "Deliver R&D Plans for 2015",
    Task_Start_Date: "2015-03-01T00:00:00",
    Task_Due_Date: "2015-03-10T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 4,
    Task_Completion: 100,
    Task_Parent_ID: 1
  },
  {
    Task_ID: 43,
    Task_Assigned_Employee_ID: 32,
    Task_Owner_ID: 3,
    Task_Subject: "Create 2015 R&D Plans",
    Task_Start_Date: "2015-03-01T00:00:00",
    Task_Due_Date: "2015-03-07T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 42
  },
  {
    Task_ID: 44,
    Task_Assigned_Employee_ID: 33,
    Task_Owner_ID: 32,
    Task_Subject: "2015 QA Strategy Report",
    Task_Start_Date: "2015-03-02T00:00:00",
    Task_Due_Date: "2015-03-05T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 42
  },
  {
    Task_ID: 45,
    Task_Assigned_Employee_ID: 31,
    Task_Owner_ID: 33,
    Task_Subject: "2015 Training Events",
    Task_Start_Date: "2015-03-02T00:00:00",
    Task_Due_Date: "2015-03-04T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 4,
    Task_Completion: 100,
    Task_Parent_ID: 4
  },
  {
    Task_ID: 46,
    Task_Assigned_Employee_ID: 2,
    Task_Owner_ID: 5,
    Task_Subject: "Non-Compete Agreements",
    Task_Start_Date: "2015-03-12T00:00:00",
    Task_Due_Date: "2015-03-14T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 1,
    Task_Completion: 100,
    Task_Parent_ID: 5
  },
  {
    Task_ID: 47,
    Task_Assigned_Employee_ID: 1,
    Task_Owner_ID: 2,
    Task_Subject: "Update NDA Agreement",
    Task_Start_Date: "2015-03-14T00:00:00",
    Task_Due_Date: "2015-03-16T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 4,
    Task_Completion: 100,
    Task_Parent_ID: 5
  },
  {
    Task_ID: 48,
    Task_Assigned_Employee_ID: 5,
    Task_Owner_ID: 2,
    Task_Subject: "Update Employee Files with New NDA",
    Task_Start_Date: "2015-03-16T00:00:00",
    Task_Due_Date: "2015-03-26T00:00:00",
    Task_Status: "Need Assistance",
    Task_Priority: 2,
    Task_Completion: 90,
    Task_Parent_ID: 5
  },
  {
    Task_ID: 49,
    Task_Assigned_Employee_ID: 6,
    Task_Owner_ID: 5,
    Task_Subject: "Sign Updated NDA",
    Task_Start_Date: "2015-03-20T00:00:00",
    Task_Due_Date: "2015-03-25T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 3,
    Task_Completion: 100,
    Task_Parent_ID: 5
  },
  {
    Task_ID: 50,
    Task_Assigned_Employee_ID: 7,
    Task_Owner_ID: 5,
    Task_Subject: "Sign Updated NDA",
    Task_Start_Date: "2015-03-20T00:00:00",
    Task_Due_Date: "2015-03-25T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 3,
    Task_Completion: 100,
    Task_Parent_ID: 5
  },
  {
    Task_ID: 51,
    Task_Assigned_Employee_ID: 8,
    Task_Owner_ID: 5,
    Task_Subject: "Sign Updated NDA",
    Task_Start_Date: "2015-03-20T00:00:00",
    Task_Due_Date: "2015-03-25T00:00:00",
    Task_Status: "Need Assistance",
    Task_Priority: 3,
    Task_Completion: 25,
    Task_Parent_ID: 5
  },
  {
    Task_ID: 52,
    Task_Assigned_Employee_ID: 9,
    Task_Owner_ID: 5,
    Task_Subject: "Sign Updated NDA",
    Task_Start_Date: "2015-03-20T00:00:00",
    Task_Due_Date: "2015-03-25T00:00:00",
    Task_Status: "In Progress",
    Task_Priority: 3,
    Task_Completion: 100,
    Task_Parent_ID: 5
  },
  {
    Task_ID: 53,
    Task_Assigned_Employee_ID: 17,
    Task_Owner_ID: 9,
    Task_Subject: "Submit Questions Regarding New NDA",
    Task_Start_Date: "2015-03-21T00:00:00",
    Task_Due_Date: "2015-03-24T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 4,
    Task_Completion: 100,
    Task_Parent_ID: 5
  },
  {
    Task_ID: 54,
    Task_Assigned_Employee_ID: 18,
    Task_Owner_ID: 9,
    Task_Subject: "Submit Questions Regarding New NDA",
    Task_Start_Date: "2015-03-21T00:00:00",
    Task_Due_Date: "2015-03-24T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 4,
    Task_Completion: 100,
    Task_Parent_ID: 5
  },
  {
    Task_ID: 55,
    Task_Assigned_Employee_ID: 19,
    Task_Owner_ID: 9,
    Task_Subject: "Submit Questions Regarding New NDA",
    Task_Start_Date: "2015-03-21T00:00:00",
    Task_Due_Date: "2015-03-24T00:00:00",
    Task_Status: "Need Assistance",
    Task_Priority: 4,
    Task_Completion: 25,
    Task_Parent_ID: 5
  },
  {
    Task_ID: 56,
    Task_Assigned_Employee_ID: 14,
    Task_Owner_ID: 10,
    Task_Subject: "Submit Signed NDA",
    Task_Start_Date: "2015-03-22T00:00:00",
    Task_Due_Date: "2015-03-24T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 3,
    Task_Completion: 100,
    Task_Parent_ID: 5
  },
  {
    Task_ID: 57,
    Task_Assigned_Employee_ID: 13,
    Task_Owner_ID: 10,
    Task_Subject: "Submit Signed NDA",
    Task_Start_Date: "2015-03-22T00:00:00",
    Task_Due_Date: "2015-03-24T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 3,
    Task_Completion: 100,
    Task_Parent_ID: 5
  },
  {
    Task_ID: 58,
    Task_Assigned_Employee_ID: 15,
    Task_Owner_ID: 10,
    Task_Subject: "Submit Signed NDA",
    Task_Start_Date: "2015-03-22T00:00:00",
    Task_Due_Date: "2015-03-24T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 3,
    Task_Completion: 100,
    Task_Parent_ID: 5
  },
  {
    Task_ID: 59,
    Task_Assigned_Employee_ID: 16,
    Task_Owner_ID: 10,
    Task_Subject: "Submit Signed NDA",
    Task_Start_Date: "2015-03-22T00:00:00",
    Task_Due_Date: "2015-03-24T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 3,
    Task_Completion: 100,
    Task_Parent_ID: 5
  },
  {
    Task_ID: 60,
    Task_Assigned_Employee_ID: 7,
    Task_Owner_ID: 1,
    Task_Subject: "Update Revenue Projections",
    Task_Start_Date: "2015-03-24T00:00:00",
    Task_Due_Date: "2015-04-07T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 6
  },
  {
    Task_ID: 61,
    Task_Assigned_Employee_ID: 8,
    Task_Owner_ID: 7,
    Task_Subject: "Review Revenue Projections",
    Task_Start_Date: "2015-03-25T00:00:00",
    Task_Due_Date: "2015-04-06T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 4,
    Task_Completion: 100,
    Task_Parent_ID: 6
  },
  {
    Task_ID: 62,
    Task_Assigned_Employee_ID: 41,
    Task_Owner_ID: 7,
    Task_Subject: "Comment on Revenue Projections",
    Task_Start_Date: "2015-03-25T00:00:00",
    Task_Due_Date: "2015-04-03T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 3,
    Task_Completion: 100,
    Task_Parent_ID: 6
  },
  {
    Task_ID: 63,
    Task_Assigned_Employee_ID: 42,
    Task_Owner_ID: 7,
    Task_Subject: "Comment on Revenue Projections",
    Task_Start_Date: "2015-03-25T00:00:00",
    Task_Due_Date: "2015-04-03T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 3,
    Task_Completion: 100,
    Task_Parent_ID: 6
  },
  {
    Task_ID: 64,
    Task_Assigned_Employee_ID: 45,
    Task_Owner_ID: 7,
    Task_Subject: "Comment on Revenue Projections",
    Task_Start_Date: "2015-03-25T00:00:00",
    Task_Due_Date: "2015-04-03T00:00:00",
    Task_Status: "Deferred",
    Task_Priority: 3,
    Task_Completion: 25,
    Task_Parent_ID: 6
  },
  {
    Task_ID: 65,
    Task_Assigned_Employee_ID: 5,
    Task_Owner_ID: 11,
    Task_Subject: "Provide New Health Insurance Docs",
    Task_Start_Date: "2015-03-28T00:00:00",
    Task_Due_Date: "2015-04-07T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 2
  },
  {
    Task_ID: 66,
    Task_Assigned_Employee_ID: 10,
    Task_Owner_ID: 11,
    Task_Subject: "Review Changes to Health Insurance Coverage",
    Task_Start_Date: "2015-04-07T00:00:00",
    Task_Due_Date: "2015-04-30T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 2
  },
  {
    Task_ID: 67,
    Task_Assigned_Employee_ID: 14,
    Task_Owner_ID: 10,
    Task_Subject: "Scan Health Insurance Forms",
    Task_Start_Date: "2015-04-15T00:00:00",
    Task_Due_Date: "2015-04-20T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 2
  },
  {
    Task_ID: 68,
    Task_Assigned_Employee_ID: 15,
    Task_Owner_ID: 14,
    Task_Subject: "Sign Health Insurance Forms",
    Task_Start_Date: "2015-04-16T00:00:00",
    Task_Due_Date: "2015-04-19T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 4,
    Task_Completion: 100,
    Task_Parent_ID: 2
  },
  {
    Task_ID: 69,
    Task_Assigned_Employee_ID: 13,
    Task_Owner_ID: 14,
    Task_Subject: "Sign Health Insurance Forms",
    Task_Start_Date: "2015-04-16T00:00:00",
    Task_Due_Date: "2015-04-19T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 4,
    Task_Completion: 100,
    Task_Parent_ID: 2
  },
  {
    Task_ID: 70,
    Task_Assigned_Employee_ID: 16,
    Task_Owner_ID: 14,
    Task_Subject: "Sign Health Insurance Forms",
    Task_Start_Date: "2015-04-16T00:00:00",
    Task_Due_Date: "2015-04-19T00:00:00",
    Task_Status: "Deferred",
    Task_Priority: 4,
    Task_Completion: 100,
    Task_Parent_ID: 2
  },
  {
    Task_ID: 71,
    Task_Assigned_Employee_ID: 18,
    Task_Owner_ID: 9,
    Task_Subject: "Follow up with West Coast Stores",
    Task_Start_Date: "2015-04-18T00:00:00",
    Task_Due_Date: "2016-02-04T00:00:00",
    Task_Status: "In Progress",
    Task_Priority: 3,
    Task_Completion: 95,
    Task_Parent_ID: 7
  },
  {
    Task_ID: 72,
    Task_Assigned_Employee_ID: 17,
    Task_Owner_ID: 9,
    Task_Subject: "Follow up with East Coast Stores",
    Task_Start_Date: "2015-04-18T00:00:00",
    Task_Due_Date: "2016-01-04T00:00:00",
    Task_Status: "In Progress",
    Task_Priority: 3,
    Task_Completion: 85,
    Task_Parent_ID: 7
  },
  {
    Task_ID: 73,
    Task_Assigned_Employee_ID: 19,
    Task_Owner_ID: 9,
    Task_Subject: "Send Email to Customers about Recall",
    Task_Start_Date: "2015-04-18T00:00:00",
    Task_Due_Date: "2015-04-30T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 4,
    Task_Completion: 100,
    Task_Parent_ID: 7
  },
  {
    Task_ID: 74,
    Task_Assigned_Employee_ID: 9,
    Task_Owner_ID: 7,
    Task_Subject: "Submit Refund Report for 2015 Recall",
    Task_Start_Date: "2015-04-25T00:00:00",
    Task_Due_Date: "2015-05-05T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 3,
    Task_Completion: 100,
    Task_Parent_ID: 7
  },
  {
    Task_ID: 75,
    Task_Assigned_Employee_ID: 2,
    Task_Owner_ID: 7,
    Task_Subject: "Give Final Approval for Refunds",
    Task_Start_Date: "2015-05-05T00:00:00",
    Task_Due_Date: "2015-05-15T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 7
  },
  {
    Task_ID: 76,
    Task_Assigned_Employee_ID: 32,
    Task_Owner_ID: 3,
    Task_Subject: "Prepare Product Recall Report",
    Task_Start_Date: "2015-05-10T00:00:00",
    Task_Due_Date: "2015-05-16T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 7
  },
  {
    Task_ID: 77,
    Task_Assigned_Employee_ID: 1,
    Task_Owner_ID: 3,
    Task_Subject: "Review Product Recall Report by Engineering Team",
    Task_Start_Date: "2015-05-17T00:00:00",
    Task_Due_Date: "2015-05-20T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 4,
    Task_Completion: 100,
    Task_Parent_ID: 7
  },
  {
    Task_ID: 78,
    Task_Assigned_Employee_ID: 31,
    Task_Owner_ID: 32,
    Task_Subject: "Create Training Course for New TVs",
    Task_Start_Date: "2015-05-29T00:00:00",
    Task_Due_Date: "2015-06-29T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 4
  },
  {
    Task_ID: 79,
    Task_Assigned_Employee_ID: 33,
    Task_Owner_ID: 31,
    Task_Subject: "Review Training Course for any Ommissions",
    Task_Start_Date: "2015-06-01T00:00:00",
    Task_Due_Date: "2015-06-15T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 3,
    Task_Completion: 100,
    Task_Parent_ID: 4
  },
  {
    Task_ID: 80,
    Task_Assigned_Employee_ID: 6,
    Task_Owner_ID: 5,
    Task_Subject: "Review Overtime Report",
    Task_Start_Date: "2015-06-10T00:00:00",
    Task_Due_Date: "2015-06-14T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 8
  },
  {
    Task_ID: 81,
    Task_Assigned_Employee_ID: 21,
    Task_Owner_ID: 6,
    Task_Subject: "Submit Overtime Request Forms",
    Task_Start_Date: "2015-06-11T00:00:00",
    Task_Due_Date: "2015-06-12T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 8
  },
  {
    Task_ID: 82,
    Task_Assigned_Employee_ID: 22,
    Task_Owner_ID: 6,
    Task_Subject: "Submit Overtime Request Forms",
    Task_Start_Date: "2015-06-11T00:00:00",
    Task_Due_Date: "2015-06-12T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 8
  },
  {
    Task_ID: 83,
    Task_Assigned_Employee_ID: 23,
    Task_Owner_ID: 6,
    Task_Subject: "Submit Overtime Request Forms",
    Task_Start_Date: "2015-06-11T00:00:00",
    Task_Due_Date: "2015-06-12T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 8
  },
  {
    Task_ID: 84,
    Task_Assigned_Employee_ID: 2,
    Task_Owner_ID: 6,
    Task_Subject: "Overtime Approval Guidelines",
    Task_Start_Date: "2015-06-15T00:00:00",
    Task_Due_Date: "2015-06-20T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 8
  },
  {
    Task_ID: 85,
    Task_Assigned_Employee_ID: 8,
    Task_Owner_ID: 12,
    Task_Subject: "Refund Request Template",
    Task_Start_Date: "2015-06-17T00:00:00",
    Task_Due_Date: "2016-04-01T00:00:00",
    Task_Status: "Deferred",
    Task_Priority: 2,
    Task_Completion: 0,
    Task_Parent_ID: 9
  },
  {
    Task_ID: 86,
    Task_Assigned_Employee_ID: 8,
    Task_Owner_ID: 12,
    Task_Subject: "Recall Rebate Form",
    Task_Start_Date: "2015-06-17T00:00:00",
    Task_Due_Date: "2016-04-01T00:00:00",
    Task_Status: "Deferred",
    Task_Priority: 2,
    Task_Completion: 0,
    Task_Parent_ID: 9
  },
  {
    Task_ID: 87,
    Task_Assigned_Employee_ID: 12,
    Task_Owner_ID: 30,
    Task_Subject: "Create Report on Customer Feedback",
    Task_Start_Date: "2015-06-20T00:00:00",
    Task_Due_Date: "2015-06-30T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 4,
    Task_Completion: 100,
    Task_Parent_ID: 9
  },
  {
    Task_ID: 88,
    Task_Assigned_Employee_ID: 8,
    Task_Owner_ID: 30,
    Task_Subject: "Review Customer Feedback Report",
    Task_Start_Date: "2015-06-30T00:00:00",
    Task_Due_Date: "2015-07-03T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 9
  },
  {
    Task_ID: 89,
    Task_Assigned_Employee_ID: 1,
    Task_Owner_ID: 8,
    Task_Subject: "Customer Feedback Report Analysis",
    Task_Start_Date: "2015-07-05T00:00:00",
    Task_Due_Date: "2016-04-09T00:00:00",
    Task_Status: "Deferred",
    Task_Priority: 2,
    Task_Completion: 0,
    Task_Parent_ID: 9
  },
  {
    Task_ID: 90,
    Task_Assigned_Employee_ID: 10,
    Task_Owner_ID: 8,
    Task_Subject: "Prepare Shipping Cost Analysis Report",
    Task_Start_Date: "2015-07-10T00:00:00",
    Task_Due_Date: "2015-07-15T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 10
  },
  {
    Task_ID: 91,
    Task_Assigned_Employee_ID: 13,
    Task_Owner_ID: 10,
    Task_Subject: "Provide Feedback on Shippers",
    Task_Start_Date: "2015-07-11T00:00:00",
    Task_Due_Date: "2015-07-14T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 10
  },
  {
    Task_ID: 92,
    Task_Assigned_Employee_ID: 15,
    Task_Owner_ID: 10,
    Task_Subject: "Provide Feedback on Shippers",
    Task_Start_Date: "2015-07-11T00:00:00",
    Task_Due_Date: "2015-07-14T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 10
  },
  {
    Task_ID: 93,
    Task_Assigned_Employee_ID: 16,
    Task_Owner_ID: 10,
    Task_Subject: "Provide Feedback on Shippers",
    Task_Start_Date: "2015-07-11T00:00:00",
    Task_Due_Date: "2015-07-14T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 10
  },
  {
    Task_ID: 94,
    Task_Assigned_Employee_ID: 2,
    Task_Owner_ID: 10,
    Task_Subject: "Select Preferred Shipper",
    Task_Start_Date: "2015-07-16T00:00:00",
    Task_Due_Date: "2015-07-20T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 10
  },
  {
    Task_ID: 95,
    Task_Assigned_Employee_ID: 1,
    Task_Owner_ID: 2,
    Task_Subject: "Complete Shipper Selection Form",
    Task_Start_Date: "2015-07-21T00:00:00",
    Task_Due_Date: "2016-04-11T00:00:00",
    Task_Status: "Deferred",
    Task_Priority: 4,
    Task_Completion: 0,
    Task_Parent_ID: 10
  },
  {
    Task_ID: 96,
    Task_Assigned_Employee_ID: 6,
    Task_Owner_ID: 22,
    Task_Subject: "Upgrade Server Hardware",
    Task_Start_Date: "2015-07-22T00:00:00",
    Task_Due_Date: "2015-07-31T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 3,
    Task_Completion: 100,
    Task_Parent_ID: 11
  },
  {
    Task_ID: 97,
    Task_Assigned_Employee_ID: 6,
    Task_Owner_ID: 21,
    Task_Subject: "Upgrade Personal Computers",
    Task_Start_Date: "2015-07-24T00:00:00",
    Task_Due_Date: "2016-04-30T00:00:00",
    Task_Status: "In Progress",
    Task_Priority: 2,
    Task_Completion: 85,
    Task_Parent_ID: 11
  },
  {
    Task_ID: 98,
    Task_Assigned_Employee_ID: 2,
    Task_Owner_ID: 6,
    Task_Subject: "Approve Personal Computer Upgrade Plan",
    Task_Start_Date: "2015-07-24T00:00:00",
    Task_Due_Date: "2015-07-31T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 11
  },
  {
    Task_ID: 99,
    Task_Assigned_Employee_ID: 3,
    Task_Owner_ID: 6,
    Task_Subject: "Decide on Mobile Devices to Use in the Field",
    Task_Start_Date: "2015-07-30T00:00:00",
    Task_Due_Date: "2015-08-02T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 4,
    Task_Completion: 100,
    Task_Parent_ID: 11
  },
  {
    Task_ID: 100,
    Task_Assigned_Employee_ID: 6,
    Task_Owner_ID: 24,
    Task_Subject: "Upgrade Apps to Windows RT or stay with WinForms",
    Task_Start_Date: "2015-08-01T00:00:00",
    Task_Due_Date: "2015-08-05T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 12
  },
  {
    Task_ID: 101,
    Task_Assigned_Employee_ID: 25,
    Task_Owner_ID: 24,
    Task_Subject: "Estimate Time Required to Touch-Enable Apps",
    Task_Start_Date: "2015-08-05T00:00:00",
    Task_Due_Date: "2015-08-07T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 12
  },
  {
    Task_ID: 102,
    Task_Assigned_Employee_ID: 23,
    Task_Owner_ID: 6,
    Task_Subject: "Report on Tranistion to Touch-Based Apps",
    Task_Start_Date: "2015-08-10T00:00:00",
    Task_Due_Date: "2015-08-11T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 12
  },
  {
    Task_ID: 103,
    Task_Assigned_Employee_ID: 3,
    Task_Owner_ID: 6,
    Task_Subject: "Try New Touch-Enabled WinForms Apps",
    Task_Start_Date: "2015-08-11T00:00:00",
    Task_Due_Date: "2015-08-15T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 12
  },
  {
    Task_ID: 104,
    Task_Assigned_Employee_ID: 24,
    Task_Owner_ID: 6,
    Task_Subject: "Rollout New Touch-Enabled WinForms Apps",
    Task_Start_Date: "2015-08-17T00:00:00",
    Task_Due_Date: "2016-04-30T00:00:00",
    Task_Status: "In Progress",
    Task_Priority: 2,
    Task_Completion: 75,
    Task_Parent_ID: 12
  },
  {
    Task_ID: 105,
    Task_Assigned_Employee_ID: 6,
    Task_Owner_ID: 3,
    Task_Subject: "Site Up-Time Report",
    Task_Start_Date: "2015-08-20T00:00:00",
    Task_Due_Date: "2015-08-24T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 4,
    Task_Completion: 100,
    Task_Parent_ID: 13
  },
  {
    Task_ID: 106,
    Task_Assigned_Employee_ID: 4,
    Task_Owner_ID: 3,
    Task_Subject: "Review Site Up-Time Report",
    Task_Start_Date: "2015-08-24T00:00:00",
    Task_Due_Date: "2015-08-30T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 3,
    Task_Completion: 100,
    Task_Parent_ID: 13
  },
  {
    Task_ID: 107,
    Task_Assigned_Employee_ID: 1,
    Task_Owner_ID: 4,
    Task_Subject: "Review Online Sales Report",
    Task_Start_Date: "2015-08-30T00:00:00",
    Task_Due_Date: "2015-09-04T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 4,
    Task_Completion: 100,
    Task_Parent_ID: 13
  },
  {
    Task_ID: 108,
    Task_Assigned_Employee_ID: 8,
    Task_Owner_ID: 4,
    Task_Subject: "Determine New Online Marketing Strategy",
    Task_Start_Date: "2015-09-03T00:00:00",
    Task_Due_Date: "2015-09-10T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 13
  },
  {
    Task_ID: 109,
    Task_Assigned_Employee_ID: 42,
    Task_Owner_ID: 8,
    Task_Subject: "New Online Marketing Strategy",
    Task_Start_Date: "2015-09-05T00:00:00",
    Task_Due_Date: "2015-09-11T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 13
  },
  {
    Task_ID: 110,
    Task_Assigned_Employee_ID: 4,
    Task_Owner_ID: 8,
    Task_Subject: "Approve New Online Marketing Strategy",
    Task_Start_Date: "2015-09-15T00:00:00",
    Task_Due_Date: "2015-09-15T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 4,
    Task_Completion: 100,
    Task_Parent_ID: 13
  },
  {
    Task_ID: 111,
    Task_Assigned_Employee_ID: 28,
    Task_Owner_ID: 8,
    Task_Subject: "Submit New Website Design",
    Task_Start_Date: "2015-09-17T00:00:00",
    Task_Due_Date: "2015-09-22T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 14
  },
  {
    Task_ID: 112,
    Task_Assigned_Employee_ID: 29,
    Task_Owner_ID: 28,
    Task_Subject: "Create Icons for Website",
    Task_Start_Date: "2015-09-17T00:00:00",
    Task_Due_Date: "2015-09-21T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 3,
    Task_Completion: 100,
    Task_Parent_ID: 111
  },
  {
    Task_ID: 113,
    Task_Assigned_Employee_ID: 6,
    Task_Owner_ID: 28,
    Task_Subject: "Review PSDs for New Website",
    Task_Start_Date: "2015-09-23T00:00:00",
    Task_Due_Date: "2015-10-15T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 4,
    Task_Completion: 100,
    Task_Parent_ID: 111
  },
  {
    Task_ID: 114,
    Task_Assigned_Employee_ID: 24,
    Task_Owner_ID: 6,
    Task_Subject: "Create New Shopping Cart",
    Task_Start_Date: "2015-09-24T00:00:00",
    Task_Due_Date: "2015-10-01T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 113
  },
  {
    Task_ID: 115,
    Task_Assigned_Employee_ID: 25,
    Task_Owner_ID: 6,
    Task_Subject: "Create New Product Pages",
    Task_Start_Date: "2015-09-24T00:00:00",
    Task_Due_Date: "2015-10-04T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 113
  },
  {
    Task_ID: 116,
    Task_Assigned_Employee_ID: 8,
    Task_Owner_ID: 6,
    Task_Subject: "Review New Product Pages",
    Task_Start_Date: "2015-10-04T00:00:00",
    Task_Due_Date: "2015-10-10T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 113
  },
  {
    Task_ID: 117,
    Task_Assigned_Employee_ID: 4,
    Task_Owner_ID: 8,
    Task_Subject: "Approve Website Launch",
    Task_Start_Date: "2015-10-10T00:00:00",
    Task_Due_Date: "2015-10-15T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 4,
    Task_Completion: 100,
    Task_Parent_ID: 113
  },
  {
    Task_ID: 118,
    Task_Assigned_Employee_ID: 6,
    Task_Owner_ID: 8,
    Task_Subject: "Launch New Website",
    Task_Start_Date: "2015-10-15T00:00:00",
    Task_Due_Date: "2015-10-16T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 3,
    Task_Completion: 100,
    Task_Parent_ID: 111
  },
  {
    Task_ID: 119,
    Task_Assigned_Employee_ID: 14,
    Task_Owner_ID: 10,
    Task_Subject: "Update Customer Shipping Profiles",
    Task_Start_Date: "2015-10-20T00:00:00",
    Task_Due_Date: "2015-10-22T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 4,
    Task_Completion: 100,
    Task_Parent_ID: 14
  },
  {
    Task_ID: 120,
    Task_Assigned_Employee_ID: 6,
    Task_Owner_ID: 10,
    Task_Subject: "Create New Shipping Return Labels",
    Task_Start_Date: "2015-10-21T00:00:00",
    Task_Due_Date: "2015-10-30T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 119
  },
  {
    Task_ID: 121,
    Task_Assigned_Employee_ID: 23,
    Task_Owner_ID: 6,
    Task_Subject: "Get Design for Shipping Return Labels",
    Task_Start_Date: "2015-10-21T00:00:00",
    Task_Due_Date: "2015-10-30T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 119
  },
  {
    Task_ID: 122,
    Task_Assigned_Employee_ID: 29,
    Task_Owner_ID: 23,
    Task_Subject: "PSD needed for Shipping Return Labels",
    Task_Start_Date: "2015-10-22T00:00:00",
    Task_Due_Date: "2015-10-27T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 119
  },
  {
    Task_ID: 123,
    Task_Assigned_Employee_ID: 6,
    Task_Owner_ID: 22,
    Task_Subject: "Request Bandwidth Increase from ISP",
    Task_Start_Date: "2015-11-01T00:00:00",
    Task_Due_Date: "2015-11-05T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 15
  },
  {
    Task_ID: 124,
    Task_Assigned_Employee_ID: 7,
    Task_Owner_ID: 6,
    Task_Subject: "Submit D&B Number to ISP for Credit Approval",
    Task_Start_Date: "2015-11-04T00:00:00",
    Task_Due_Date: "2015-11-07T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 4,
    Task_Completion: 100,
    Task_Parent_ID: 15
  },
  {
    Task_ID: 125,
    Task_Assigned_Employee_ID: 2,
    Task_Owner_ID: 7,
    Task_Subject: "Contact ISP and Discuss Payment Options",
    Task_Start_Date: "2015-11-05T00:00:00",
    Task_Due_Date: "2015-11-06T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 3,
    Task_Completion: 100,
    Task_Parent_ID: 15
  },
  {
    Task_ID: 126,
    Task_Assigned_Employee_ID: 18,
    Task_Owner_ID: 9,
    Task_Subject: "Prepare Year-End Support Summary Report",
    Task_Start_Date: "2015-11-10T00:00:00",
    Task_Due_Date: "2015-11-15T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 16
  },
  {
    Task_ID: 127,
    Task_Assigned_Employee_ID: 19,
    Task_Owner_ID: 18,
    Task_Subject: "Analyze Support Traffic for 2015",
    Task_Start_Date: "2015-11-11T00:00:00",
    Task_Due_Date: "2015-11-14T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 16
  },
  {
    Task_ID: 128,
    Task_Assigned_Employee_ID: 33,
    Task_Owner_ID: 31,
    Task_Subject: "Review New Training Material",
    Task_Start_Date: "2015-11-14T00:00:00",
    Task_Due_Date: "2015-11-18T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 17
  },
  {
    Task_ID: 129,
    Task_Assigned_Employee_ID: 31,
    Task_Owner_ID: 33,
    Task_Subject: "Distribute Training Material to Support Staff",
    Task_Start_Date: "2015-11-18T00:00:00",
    Task_Due_Date: "2015-11-30T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 17
  },
  {
    Task_ID: 130,
    Task_Assigned_Employee_ID: 9,
    Task_Owner_ID: 31,
    Task_Subject: "Training Material Distribution Schedule",
    Task_Start_Date: "2015-11-30T00:00:00",
    Task_Due_Date: "2015-12-02T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 4,
    Task_Completion: 100,
    Task_Parent_ID: 17
  },
  {
    Task_ID: 131,
    Task_Assigned_Employee_ID: 28,
    Task_Owner_ID: 9,
    Task_Subject: "Provide New Artwork to Support Team",
    Task_Start_Date: "2015-12-03T00:00:00",
    Task_Due_Date: "2015-12-04T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 17
  },
  {
    Task_ID: 132,
    Task_Assigned_Employee_ID: 29,
    Task_Owner_ID: 28,
    Task_Subject: "Publish New Art on the Server",
    Task_Start_Date: "2015-12-03T00:00:00",
    Task_Due_Date: "2015-12-04T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 4,
    Task_Completion: 100,
    Task_Parent_ID: 131
  },
  {
    Task_ID: 133,
    Task_Assigned_Employee_ID: 12,
    Task_Owner_ID: 8,
    Task_Subject: "Replace Old Artwork with New Artwork",
    Task_Start_Date: "2015-12-07T00:00:00",
    Task_Due_Date: "2015-12-15T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 131
  },
  {
    Task_ID: 134,
    Task_Assigned_Employee_ID: 20,
    Task_Owner_ID: 8,
    Task_Subject: "Replace Old Artwork with New Artwork",
    Task_Start_Date: "2015-12-07T00:00:00",
    Task_Due_Date: "2015-12-15T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 131
  },
  {
    Task_ID: 135,
    Task_Assigned_Employee_ID: 40,
    Task_Owner_ID: 8,
    Task_Subject: "Replace Old Artwork with New Artwork",
    Task_Start_Date: "2015-12-07T00:00:00",
    Task_Due_Date: "2015-12-15T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 131
  },
  {
    Task_ID: 136,
    Task_Assigned_Employee_ID: 8,
    Task_Owner_ID: 45,
    Task_Subject: "Ship New Brochures to Field",
    Task_Start_Date: "2015-12-19T00:00:00",
    Task_Due_Date: "2015-12-31T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 4,
    Task_Completion: 100,
    Task_Parent_ID: 17
  },
  {
    Task_ID: 137,
    Task_Assigned_Employee_ID: 14,
    Task_Owner_ID: 8,
    Task_Subject: "Ship Brochures to Todd Hoffman",
    Task_Start_Date: "2015-12-23T00:00:00",
    Task_Due_Date: "2015-12-31T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 3,
    Task_Completion: 100,
    Task_Parent_ID: 17
  },
  {
    Task_ID: 138,
    Task_Assigned_Employee_ID: 22,
    Task_Owner_ID: 3,
    Task_Subject: "Update Server with Service Packs",
    Task_Start_Date: "2015-12-24T00:00:00",
    Task_Due_Date: "2015-12-24T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 3,
    Task_Completion: 100,
    Task_Parent_ID: 18
  },
  {
    Task_ID: 139,
    Task_Assigned_Employee_ID: 22,
    Task_Owner_ID: 6,
    Task_Subject: "Install New Database",
    Task_Start_Date: "2015-12-27T00:00:00",
    Task_Due_Date: "2015-12-28T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 4,
    Task_Completion: 100,
    Task_Parent_ID: 18
  },
  {
    Task_ID: 140,
    Task_Assigned_Employee_ID: 6,
    Task_Owner_ID: 22,
    Task_Subject: "Approve Overtime for HR",
    Task_Start_Date: "2015-12-29T00:00:00",
    Task_Due_Date: "2015-12-29T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 18
  },
  {
    Task_ID: 141,
    Task_Assigned_Employee_ID: 32,
    Task_Owner_ID: 3,
    Task_Subject: "Review New HDMI Specification",
    Task_Start_Date: "2016-01-02T00:00:00",
    Task_Due_Date: "2016-01-31T00:00:00",
    Task_Status: "Deferred",
    Task_Priority: 2,
    Task_Completion: 50,
    Task_Parent_ID: 19
  },
  {
    Task_ID: 142,
    Task_Assigned_Employee_ID: 3,
    Task_Owner_ID: 32,
    Task_Subject: "Approval on Converting to New HDMI Specification",
    Task_Start_Date: "2016-01-11T00:00:00",
    Task_Due_Date: "2016-01-31T00:00:00",
    Task_Status: "Deferred",
    Task_Priority: 2,
    Task_Completion: 75,
    Task_Parent_ID: 19
  },
  {
    Task_ID: 143,
    Task_Assigned_Employee_ID: 24,
    Task_Owner_ID: 3,
    Task_Subject: "Create New Spike for Automation Server",
    Task_Start_Date: "2016-01-15T00:00:00",
    Task_Due_Date: "2016-01-27T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 4,
    Task_Completion: 100,
    Task_Parent_ID: 20
  },
  {
    Task_ID: 144,
    Task_Assigned_Employee_ID: 41,
    Task_Owner_ID: 8,
    Task_Subject: "Report on Retail Sales Strategy for 2016",
    Task_Start_Date: "2016-01-20T00:00:00",
    Task_Due_Date: "2016-01-31T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 4,
    Task_Completion: 100,
    Task_Parent_ID: 21
  },
  {
    Task_ID: 145,
    Task_Assigned_Employee_ID: 25,
    Task_Owner_ID: 3,
    Task_Subject: "Code Review - New Automation Server",
    Task_Start_Date: "2016-01-27T00:00:00",
    Task_Due_Date: "2016-02-15T00:00:00",
    Task_Status: "In Progress",
    Task_Priority: 2,
    Task_Completion: 75,
    Task_Parent_ID: 20
  },
  {
    Task_ID: 146,
    Task_Assigned_Employee_ID: 17,
    Task_Owner_ID: 31,
    Task_Subject: "Feedback on New Training Course",
    Task_Start_Date: "2016-01-28T00:00:00",
    Task_Due_Date: "2016-02-05T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 17
  },
  {
    Task_ID: 147,
    Task_Assigned_Employee_ID: 10,
    Task_Owner_ID: 7,
    Task_Subject: "Send Monthly Invoices from Shippers",
    Task_Start_Date: "2016-02-01T00:00:00",
    Task_Due_Date: "2016-02-07T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 10
  },
  {
    Task_ID: 148,
    Task_Assigned_Employee_ID: 40,
    Task_Owner_ID: 39,
    Task_Subject: "Schedule Meeting with Sales Team",
    Task_Start_Date: "2016-02-07T00:00:00",
    Task_Due_Date: "2016-02-09T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 21
  },
  {
    Task_ID: 149,
    Task_Assigned_Employee_ID: 42,
    Task_Owner_ID: 40,
    Task_Subject: "Confirm Availability for Sales Meeting",
    Task_Start_Date: "2016-02-09T00:00:00",
    Task_Due_Date: "2016-02-09T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 4,
    Task_Completion: 100,
    Task_Parent_ID: 21
  },
  {
    Task_ID: 150,
    Task_Assigned_Employee_ID: 39,
    Task_Owner_ID: 40,
    Task_Subject: "Reschedule Sales Team Meeting",
    Task_Start_Date: "2016-02-10T00:00:00",
    Task_Due_Date: "2016-02-10T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 4,
    Task_Completion: 100,
    Task_Parent_ID: 21
  },
  {
    Task_ID: 151,
    Task_Assigned_Employee_ID: 45,
    Task_Owner_ID: 44,
    Task_Subject: "Update Database with New Leads",
    Task_Start_Date: "2016-03-01T00:00:00",
    Task_Due_Date: "2016-03-10T00:00:00",
    Task_Status: "In Progress",
    Task_Priority: 2,
    Task_Completion: 80,
    Task_Parent_ID: 18
  },
  {
    Task_ID: 152,
    Task_Assigned_Employee_ID: 12,
    Task_Owner_ID: 41,
    Task_Subject: "Send Territory Sales Breakdown",
    Task_Start_Date: "2016-03-13T00:00:00",
    Task_Due_Date: "2016-03-16T00:00:00",
    Task_Status: "In Progress",
    Task_Priority: 4,
    Task_Completion: 50,
    Task_Parent_ID: 22
  },
  {
    Task_ID: 153,
    Task_Assigned_Employee_ID: 41,
    Task_Owner_ID: 1,
    Task_Subject: "Territory Sales Breakdown Report",
    Task_Start_Date: "2016-03-17T00:00:00",
    Task_Due_Date: "2016-03-17T00:00:00",
    Task_Status: "In Progress",
    Task_Priority: 3,
    Task_Completion: 50,
    Task_Parent_ID: 22
  },
  {
    Task_ID: 154,
    Task_Assigned_Employee_ID: 3,
    Task_Owner_ID: 1,
    Task_Subject: "Return Merchandise Report",
    Task_Start_Date: "2016-03-17T00:00:00",
    Task_Due_Date: "2016-03-18T00:00:00",
    Task_Status: "In Progress",
    Task_Priority: 4,
    Task_Completion: 25,
    Task_Parent_ID: 22
  },
  {
    Task_ID: 155,
    Task_Assigned_Employee_ID: 32,
    Task_Owner_ID: 3,
    Task_Subject: "Report on the State of Engineering Dept",
    Task_Start_Date: "2016-03-18T00:00:00",
    Task_Due_Date: "2016-03-19T00:00:00",
    Task_Status: "Not Started",
    Task_Priority: 2,
    Task_Completion: 0,
    Task_Parent_ID: 22
  },
  {
    Task_ID: 156,
    Task_Assigned_Employee_ID: 6,
    Task_Owner_ID: 5,
    Task_Subject: "Staff Productivity Report",
    Task_Start_Date: "2016-03-20T00:00:00",
    Task_Due_Date: "2016-03-21T00:00:00",
    Task_Status: "Not Started",
    Task_Priority: 2,
    Task_Completion: 0,
    Task_Parent_ID: 23
  },
  {
    Task_ID: 157,
    Task_Assigned_Employee_ID: 5,
    Task_Owner_ID: 1,
    Task_Subject: "Review HR Budget Company Wide",
    Task_Start_Date: "2016-03-20T00:00:00",
    Task_Due_Date: "2016-03-25T00:00:00",
    Task_Status: "In Progress",
    Task_Priority: 2,
    Task_Completion: 40,
    Task_Parent_ID: 23
  },
  {
    Task_ID: 158,
    Task_Assigned_Employee_ID: 8,
    Task_Owner_ID: 5,
    Task_Subject: "Sales Dept Budget Request Report",
    Task_Start_Date: "2016-03-23T00:00:00",
    Task_Due_Date: "2016-03-25T00:00:00",
    Task_Status: "In Progress",
    Task_Priority: 4,
    Task_Completion: 75,
    Task_Parent_ID: 23
  },
  {
    Task_ID: 159,
    Task_Assigned_Employee_ID: 9,
    Task_Owner_ID: 5,
    Task_Subject: "Support Dept Budget Report",
    Task_Start_Date: "2016-03-23T00:00:00",
    Task_Due_Date: "2016-03-25T00:00:00",
    Task_Status: "In Progress",
    Task_Priority: 4,
    Task_Completion: 60,
    Task_Parent_ID: 23
  },
  {
    Task_ID: 160,
    Task_Assigned_Employee_ID: 6,
    Task_Owner_ID: 5,
    Task_Subject: "IT Dept Budget Request Report",
    Task_Start_Date: "2016-03-23T00:00:00",
    Task_Due_Date: "2016-03-25T00:00:00",
    Task_Status: "In Progress",
    Task_Priority: 4,
    Task_Completion: 30,
    Task_Parent_ID: 23
  },
  {
    Task_ID: 161,
    Task_Assigned_Employee_ID: 32,
    Task_Owner_ID: 5,
    Task_Subject: "Engineering Dept Budget Request Report",
    Task_Start_Date: "2016-03-23T00:00:00",
    Task_Due_Date: "2016-03-25T00:00:00",
    Task_Status: "Deferred",
    Task_Priority: 4,
    Task_Completion: 0,
    Task_Parent_ID: 23
  },
  {
    Task_ID: 162,
    Task_Assigned_Employee_ID: 26,
    Task_Owner_ID: 7,
    Task_Subject: "1Q Travel Spend Report",
    Task_Start_Date: "2016-03-24T00:00:00",
    Task_Due_Date: "2016-03-25T00:00:00",
    Task_Status: "In Progress",
    Task_Priority: 2,
    Task_Completion: 30,
    Task_Parent_ID: 23
  },
  {
    Task_ID: 163,
    Task_Assigned_Employee_ID: 7,
    Task_Owner_ID: 27,
    Task_Subject: "Approve Benefits Upgrade Package",
    Task_Start_Date: "2016-03-26T00:00:00",
    Task_Due_Date: "2016-03-27T00:00:00",
    Task_Status: "Deferred",
    Task_Priority: 2,
    Task_Completion: 0,
    Task_Parent_ID: 23
  },
  {
    Task_ID: 164,
    Task_Assigned_Employee_ID: 5,
    Task_Owner_ID: 7,
    Task_Subject: "Final Budget Review",
    Task_Start_Date: "2016-03-26T00:00:00",
    Task_Due_Date: "2016-03-27T00:00:00",
    Task_Status: "In Progress",
    Task_Priority: 4,
    Task_Completion: 25,
    Task_Parent_ID: 23
  },
  {
    Task_ID: 165,
    Task_Assigned_Employee_ID: 2,
    Task_Owner_ID: 1,
    Task_Subject: "State of Operations Report",
    Task_Start_Date: "2016-03-28T00:00:00",
    Task_Due_Date: "2016-03-31T00:00:00",
    Task_Status: "In Progress",
    Task_Priority: 4,
    Task_Completion: 45,
    Task_Parent_ID: 22
  },
  {
    Task_ID: 166,
    Task_Assigned_Employee_ID: 42,
    Task_Owner_ID: 2,
    Task_Subject: "Online Sales Report",
    Task_Start_Date: "2016-03-29T00:00:00",
    Task_Due_Date: "2016-03-30T00:00:00",
    Task_Status: "In Progress",
    Task_Priority: 4,
    Task_Completion: 55,
    Task_Parent_ID: 22
  },
  {
    Task_ID: 167,
    Task_Assigned_Employee_ID: 13,
    Task_Owner_ID: 10,
    Task_Subject: "Reprint All Shipping Labels",
    Task_Start_Date: "2016-04-01T00:00:00",
    Task_Due_Date: "2016-04-10T00:00:00",
    Task_Status: "In Progress",
    Task_Priority: 2,
    Task_Completion: 10,
    Task_Parent_ID: 24
  },
  {
    Task_ID: 168,
    Task_Assigned_Employee_ID: 28,
    Task_Owner_ID: 13,
    Task_Subject: "Shipping Label Artwork",
    Task_Start_Date: "2016-04-02T00:00:00",
    Task_Due_Date: "2016-04-09T00:00:00",
    Task_Status: "In Progress",
    Task_Priority: 2,
    Task_Completion: 40,
    Task_Parent_ID: 24
  },
  {
    Task_ID: 169,
    Task_Assigned_Employee_ID: 13,
    Task_Owner_ID: 29,
    Task_Subject: "Specs for New Shipping Label",
    Task_Start_Date: "2016-04-04T00:00:00",
    Task_Due_Date: "2016-04-05T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 2,
    Task_Completion: 100,
    Task_Parent_ID: 24
  },
  {
    Task_ID: 170,
    Task_Assigned_Employee_ID: 15,
    Task_Owner_ID: 10,
    Task_Subject: "Move Packaging Materials to New Warehouse",
    Task_Start_Date: "2016-04-05T00:00:00",
    Task_Due_Date: "2016-04-15T00:00:00",
    Task_Status: "In Progress",
    Task_Priority: 2,
    Task_Completion: 60,
    Task_Parent_ID: 25
  },
  {
    Task_ID: 171,
    Task_Assigned_Employee_ID: 16,
    Task_Owner_ID: 10,
    Task_Subject: "Move Inventory to New Warehouse",
    Task_Start_Date: "2016-04-05T00:00:00",
    Task_Due_Date: "2016-04-15T00:00:00",
    Task_Status: "In Progress",
    Task_Priority: 2,
    Task_Completion: 70,
    Task_Parent_ID: 25
  },
  {
    Task_ID: 172,
    Task_Assigned_Employee_ID: 14,
    Task_Owner_ID: 10,
    Task_Subject: "Take Forklift to Service Center",
    Task_Start_Date: "2016-04-07T00:00:00",
    Task_Due_Date: "2016-04-18T00:00:00",
    Task_Status: "In Progress",
    Task_Priority: 2,
    Task_Completion: 60,
    Task_Parent_ID: 26
  },
  {
    Task_ID: 173,
    Task_Assigned_Employee_ID: 10,
    Task_Owner_ID: 14,
    Task_Subject: "Approve Rental of Forklift",
    Task_Start_Date: "2016-04-08T00:00:00",
    Task_Due_Date: "2016-04-09T00:00:00",
    Task_Status: "Need Assistance",
    Task_Priority: 4,
    Task_Completion: 0,
    Task_Parent_ID: 26
  },
  {
    Task_ID: 174,
    Task_Assigned_Employee_ID: 7,
    Task_Owner_ID: 10,
    Task_Subject: "Give Final Approval to Rent Forklift",
    Task_Start_Date: "2016-04-08T00:00:00",
    Task_Due_Date: "2016-04-08T00:00:00",
    Task_Status: "Need Assistance",
    Task_Priority: 2,
    Task_Completion: 0,
    Task_Parent_ID: 26
  },
  {
    Task_ID: 175,
    Task_Assigned_Employee_ID: 9,
    Task_Owner_ID: 30,
    Task_Subject: "Review Complaint Reports",
    Task_Start_Date: "2016-04-17T00:00:00",
    Task_Due_Date: "2016-04-30T00:00:00",
    Task_Status: "In Progress",
    Task_Priority: 4,
    Task_Completion: 40,
    Task_Parent_ID: 22
  },
  {
    Task_ID: 176,
    Task_Assigned_Employee_ID: 6,
    Task_Owner_ID: 9,
    Task_Subject: "Review Website Complaint Reports",
    Task_Start_Date: "2016-04-18T00:00:00",
    Task_Due_Date: "2016-04-24T00:00:00",
    Task_Status: "In Progress",
    Task_Priority: 2,
    Task_Completion: 65,
    Task_Parent_ID: 22
  },
  {
    Task_ID: 177,
    Task_Assigned_Employee_ID: 33,
    Task_Owner_ID: 37,
    Task_Subject: "Test New Automation App",
    Task_Start_Date: "2016-04-20T00:00:00",
    Task_Due_Date: "2016-04-30T00:00:00",
    Task_Status: "In Progress",
    Task_Priority: 2,
    Task_Completion: 80,
    Task_Parent_ID: 20
  },
  {
    Task_ID: 178,
    Task_Assigned_Employee_ID: 38,
    Task_Owner_ID: 33,
    Task_Subject: "Fix Synchronization Issues",
    Task_Start_Date: "2016-04-21T00:00:00",
    Task_Due_Date: "2016-04-21T00:00:00",
    Task_Status: "Completed",
    Task_Priority: 4,
    Task_Completion: 100,
    Task_Parent_ID: 20
  },
  {
    Task_ID: 179,
    Task_Assigned_Employee_ID: 22,
    Task_Owner_ID: 24,
    Task_Subject: "Free Up Space for New Application Set",
    Task_Start_Date: "2016-04-19T00:00:00",
    Task_Due_Date: "2016-04-19T00:00:00",
    Task_Status: "Not Started",
    Task_Priority: 2,
    Task_Completion: 0,
    Task_Parent_ID: 20
  },
  {
    Task_ID: 180,
    Task_Assigned_Employee_ID: 9,
    Task_Owner_ID: 30,
    Task_Subject: "Support Team Evaluation Report",
    Task_Start_Date: "2016-05-01T00:00:00",
    Task_Due_Date: "2016-05-07T00:00:00",
    Task_Status: "Deferred",
    Task_Priority: 2,
    Task_Completion: 0,
    Task_Parent_ID: 22
  },
  {
    Task_ID: 181,
    Task_Assigned_Employee_ID: 1,
    Task_Owner_ID: 30,
    Task_Subject: "Review New Customer Follow Up Plan",
    Task_Start_Date: "2016-05-05T00:00:00",
    Task_Due_Date: "2016-05-11T00:00:00",
    Task_Status: "In Progress",
    Task_Priority: 2,
    Task_Completion: 75,
    Task_Parent_ID: 27
  },
  {
    Task_ID: 182,
    Task_Assigned_Employee_ID: 2,
    Task_Owner_ID: 1,
    Task_Subject: "Submit Customer Follow Up Plan Feedback",
    Task_Start_Date: "2016-05-06T00:00:00",
    Task_Due_Date: "2016-05-10T00:00:00",
    Task_Status: "Deferred",
    Task_Priority: 2,
    Task_Completion: 0,
    Task_Parent_ID: 27
  }
];

var employees = [
  {
    ID: 1,
    Name: "John Heart"
  },
  {
    ID: 2,
    Name: "Samantha Bright"
  },
  {
    ID: 3,
    Name: "Arthur Miller"
  },
  {
    ID: 4,
    Name: "Robert Reagan"
  },
  {
    ID: 5,
    Name: "Greta Sims"
  },
  {
    ID: 6,
    Name: "Brett Wade"
  },
  {
    ID: 7,
    Name: "Sandra Johnson"
  },
  {
    ID: 8,
    Name: "Ed Holmes"
  },
  {
    ID: 9,
    Name: "Barb Banks"
  },
  {
    ID: 10,
    Name: "Kevin Carter"
  },
  {
    ID: 11,
    Name: "Cindy Stanwick"
  },
  {
    ID: 12,
    Name: "Sammy Hill"
  },
  {
    ID: 13,
    Name: "Davey Jones"
  },
  {
    ID: 14,
    Name: "Victor Norris"
  },
  {
    ID: 15,
    Name: "Mary Stern"
  },
  {
    ID: 16,
    Name: "Robin Cosworth"
  },
  {
    ID: 17,
    Name: "Kelly Rodriguez"
  },
  {
    ID: 18,
    Name: "James Anderson"
  },
  {
    ID: 19,
    Name: "Antony Remmen"
  },
  {
    ID: 20,
    Name: "Olivia Peyton"
  },
  {
    ID: 21,
    Name: "Taylor Riley"
  },
  {
    ID: 22,
    Name: "Amelia Harper"
  },
  {
    ID: 23,
    Name: "Wally Hobbs"
  },
  {
    ID: 24,
    Name: "Brad Jameson"
  },
  {
    ID: 25,
    Name: "Karen Goodson"
  },
  {
    ID: 26,
    Name: "Marcus Orbison"
  },
  {
    ID: 27,
    Name: "Sandy Bright"
  },
  {
    ID: 28,
    Name: "Morgan Kennedy"
  },
  {
    ID: 29,
    Name: "Violet Bailey"
  },
  {
    ID: 30,
    Name: "Ken Samuelson"
  },
  {
    ID: 31,
    Name: "Nat Maguiree"
  },
  {
    ID: 32,
    Name: "Bart Arnaz"
  },
  {
    ID: 33,
    Name: "Leah Simpson"
  },
  {
    ID: 34,
    Name: "Arnie Schwartz"
  },
  {
    ID: 35,
    Name: "Billy Zimmer"
  },
  {
    ID: 36,
    Name: "Samantha Piper"
  },
  {
    ID: 37,
    Name: "Maggie Boxter"
  },
  {
    ID: 38,
    Name: "Terry Bradley"
  },
  {
    ID: 39,
    Name: "Gabe Jones"
  },
  {
    ID: 40,
    Name: "Lucy Ball"
  },
  {
    ID: 41,
    Name: "Jim Packard"
  },
  {
    ID: 42,
    Name: "Hannah Brookly"
  },
  {
    ID: 43,
    Name: "Harv Mudd"
  },
  {
    ID: 44,
    Name: "Clark Morgan"
  },
  {
    ID: 45,
    Name: "Todd Hoffman"
  },
  {
    ID: 46,
    Name: "Jackie Garmin"
  },
  {
    ID: 47,
    Name: "Lincoln Bartlett"
  },
  {
    ID: 48,
    Name: "Brad Farkus"
  },
  {
    ID: 49,
    Name: "Jenny Hobbs"
  },
  {
    ID: 50,
    Name: "Dallas Lou"
  },
  {
    ID: 51,
    Name: "Stu Pizaro"
  }
];
