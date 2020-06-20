var urlOrigin = window.location.origin;
var urlREST = urlOrigin + "/npm/api";
var idFormPopup;

$(document).ready(function () {
  var taskStore = new DevExpress.data.CustomStore({
    key: "ID",
    load: function () {
      return $.getJSON(urlREST + "/task");
    },
    insert: function (values) {
      return $.ajax({
        url: urlREST + "/task",
        method: "POST",
        processData: false,
        contentType: "application/json",
        data: JSON.stringify(values)
      });
    },
    update: function (key, values) {
      return $.ajax({
        url: urlREST + "/task/" + encodeURIComponent(key),
        method: "PUT",
        processData: false,
        contentType: "application/json",
        data: JSON.stringify(values)
      });
    },
    remove: function (key) {
      return $.ajax({
        url: urlREST + "/task/" + encodeURIComponent(key),
        method: "DELETE"
      });
    },
    onBeforeSend: function (method, ajaxOptions) {
      ajaxOptions.xhrFields = {
        withCredentials: true
      };
    }
  });

  var lookupDataSource = {
    store: new DevExpress.data.CustomStore({
      key: "ID",
      loadMode: "raw",
      load: function () {
        return $.getJSON(urlREST + "/user/lookup");
      }
    }),
    sort: "userName"
  };

  var lookupProject = {
    store: new DevExpress.data.CustomStore({
      key: "ID",
      loadMode: "raw",
      load: function () {
        return $.getJSON(urlREST + "/project/lookup");
      }
    }),
    sort: "code"
  };

  var treeList = $("#formTask")
    .dxTreeList({
      dataSource: taskStore,
      showBorders: true,
      columnAutoWidth: true,
      showColumnLines: true,
      showRowLines: true,
      rowAlternationEnabled: true,
      wordWrapEnabled: true,
      keyExpr: "ID",
      rowDragging: {
        allowDropInsideItem: true,
        onDragChange: function (e) {
          var visibleRows = treeList.getVisibleRows(),
            sourceNode = treeList.getNodeByKey(e.itemData.ID),
            targetNode = visibleRows[e.toIndex].node;

          while (targetNode && targetNode.data) {
            if (targetNode.data.ID === sourceNode.data.ID) {
              e.cancel = true;
              break;
            }
            targetNode = targetNode.parent;
          }
        },
        onReorder: function (e) {
          var visibleRows = e.component.getVisibleRows(),
            sourceData = e.itemData,
            targetData = visibleRows[e.toIndex].data;

          if (e.dropInsideItem) {
            console.log(e.itemData);
            e.itemData.ParentId = targetData.ID;
          } else {
            var sourceIndex = taskStore.indexOf(sourceData),
              targetIndex = taskStore.indexOf(targetData);

            if (sourceData.ParentId !== targetData.ParentId) {
              sourceData.ParentId = targetData.ParentId;
              if (e.toIndex > e.fromIndex) {
                targetIndex++;
              }
            }

            taskStore.splice(sourceIndex, 1);
            taskStore.splice(targetIndex, 0, sourceData);
          }

          $.ajax({
            url: urlREST + "/task/" + e.itemData.ID,
            method: "PUT",
            processData: false,
            contentType: "application/json",
            data: JSON.stringify({
              ParentId: e.itemData.ParentId
            })
          }).done(function (msg) {
            //alert("Data Saved: " + msg);
          });

          e.component.refresh();
        }
      },
      editing: {
        mode: "row",
        refreshMode: "full",
        allowAdding: true,
        allowUpdating: true,
        allowDeleting: true
      },
      onEditorPreparing: function (e) {
        if (e.dataField === "Status" && e.parentType === "dataRow") {
          e.editorName = "dxSelectBox";
        }
        if (e.dataField === "ProjectId" && e.parentType === "dataRow") {
          e.editorName = "dxSelectBox";
        }
        if (e.dataField === "AssignedUser" && e.parentType === "dataRow") {
          e.editorName = "dxSelectBox";
        }
        if (e.dataField === "Priority" && e.parentType === "dataRow") {
          e.editorName = "dxSelectBox";
        }
        if (e.dataField === "StartDate" && e.parentType === "dataRow") {
          e.editorOptions.max = e.row.data.DueDate;
        }
        if (e.dataField === "DueDate" && e.parentType === "dataRow") {
          e.editorOptions.min = e.row.data.StartDate;
        }
      },
      searchPanel: {
        visible: true,
        width: 300
      },
      paging: {
        pageSize: 15
      },
      parentIdExpr: "ParentId",
      columns: [{
          dataField: "ID",
          visible: false
        },
        {
          dataField: "ProjectId",
          caption: "Project",
          lookup: {
            dataSource: lookupProject,
            valueExpr: "ID",
            displayExpr: "code"
          },
          validationRules: [{
            type: "required"
          }]
        },
        {
          dataField: "TaskName",
          validationRules: [{
            type: "required"
          }]
        },
        {
          caption: "Estimate (Hours)",
          dataField: "Estimate",
          dataType: "number"
        },
        {
          dataField: "StartDate",
          dataType: "date"
        },
        {
          dataField: "DueDate",
          dataType: "date"
        },
        {
          caption: "Progress %",
          dataField: "Progress",
          dataType: "number"
        },
        {
          dataField: "Priority",
          editorOptions: {
            dataSource: [{
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
          editorOptions: {
            dataSource: [{
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
          caption: "Assigned User",
          lookup: {
            dataSource: lookupDataSource,
            valueExpr: "ID",
            displayExpr: "userName"
          },
          validationRules: [{
            type: "required"
          }]
        }
      ],
      onInitNewRow: function (e) {
        e.data.Status = "Not Started";
        e.data.Priority = "Normal";
        e.data.StartDate = new Date();
        e.data.DueDate = new Date();
      }
    })
    .dxTreeList("instance");
});