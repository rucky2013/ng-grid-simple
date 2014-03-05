// main.js


'use strict';

var app = angular.module('myApp', ['ngGrid','ui.bootstrap']);

app.service('sharedProperties',function(){
  var allData =    [{"name": "王二", "age": 32, "birthday": "Aug 3, 1978", "salary": 6000, "status": false},
                    {"name": "李狗", "age": 25, "birthday": "Aug 3, 1988", "salary": 6000, "status": true},
                    { "name": "Moroni", "age": 50, "birthday": "Oct 28, 1970", "salary": 5000, "status": true},
                    { "name": "Moris", "age": 43, "birthday": "Oct 28, 1970", "salary": 5000, "status": false},
                    { "name": "Nicolas", "age": 42, "birthday": "Oct 28, 1970", "salary": 5000, "status": true},
                    { "name": "Tiancum", "age": 43, "birthday": "Feb 12, 1985", "salary": 70000, "status": false},
                    { "name": "Jacob", "age": 27, "birthday": "Aug 23, 1983", "salary": 40000, "status": true},
                    { "name": "Nephi", "age": 29, "birthday": "May 31, 2010", "salary": 50000 , "status": false},
                    { "name": "Enos", "age": 34, "birthday": "Aug 3, 2008", "salary": 30000 , "status": true}]; 
  var alerts = [];
  return {
    getData : function(){
      return allData;
    },
    setData : function(val){
      allData = val;
    },
    getAlerts: function(val){
      return alerts;
    },
    rmAlerts: function(index){
      index = index || 0 ; 
      alerts.splice(index, 1);
    }
  }
})


app.controller('AlertsCtrl', function($scope, sharedProperties){

  $scope.alerts = sharedProperties.getAlerts();

});

app.controller("MyCtrl4",function($scope, $modal, $log, $timeout, sharedProperties){
 
  $scope.mySelections = [];
  $scope.myData = [];
  $scope.allData = sharedProperties.getData();
  $scope.alerts = sharedProperties.getAlerts();

  $scope.total_salary = function(){
    var sum = 0,data=$scope.myData;
    for(var i=0;i<data.length;i++){
      sum += parseInt(data[i].salary);
    }
    return sum
  };
  $scope.addAlert = function(msg) {
    $scope.alerts.push(msg);
    $timeout($scope.closeAlert,2000)
  };
  $scope.closeAlert = function(index) {
    index = index || 0 ; 
    $scope.alerts.splice(index, 1);
  };  

  $scope.deleteSelected = function() {
    if(!confirm("delete confirm ?")) return;
    angular.forEach($scope.mySelections, function(rowItem) { 
        $scope.allData.splice($scope.allData.indexOf(rowItem),1);
      });
    $scope.addAlert({type: 'danger', msg: "成功删除"+$scope.mySelections.length+"项"});
    $scope.gridOptions.selectAll(false);
  };


// ---------------------------paging----------------------------------------------
    $scope.filterOptions = {
        filterText: "",
        useExternalFilter: false
    }; 
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [5, 10, 20],
        pageSize: 5,
        currentPage: 1
    };  
    $scope.setPagingData = function(data, page, pageSize){  
        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.myData = pagedData;
        $scope.totalServerItems = data.length;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
        setTimeout(function () {
            var data = sharedProperties.getData();
            if (searchText) {
                var ft = searchText.toLowerCase();
                data = data.filter(function(item) {
                        return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                    });
                $scope.setPagingData(data,page,pageSize);
            } else {
                $scope.setPagingData(data,page,pageSize);
            }
        }, 100);
    };
    


    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
  
    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
    $scope.$watch('filterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);

    $scope.$watch('allData', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);

    $scope.gridOptions = {
      data: 'myData',
      enableCellSelection: true,
      enablePaging: true,
      selectedItems : $scope.mySelections,
      showSelectionCheckbox : true,
      selectWithCheckboxOnly: true,
      enableCellEdit: true,
      showFooter: true,
      showFilter: true,
      showColumnMenu: true,
      columnDefs: [{ field: "name", enableCellEdit: false},
                      { field: "status", cellTemplate: '<div class="ngCellText" ng-cell-text ng-class="col.colIndex()"><span ng-show="COL_FIELD" class="glyphicon glyphicon-ok"></span></div>'},
                      { field: "age", cellFilter: 'number'},
                      { field: "birthday", cellFilter: 'date'},
                      { field: "salary", cellFilter: 'currency'}],
      totalServerItems: $scope.testGrid,
      pagingOptions: $scope.pagingOptions,
      filterOptions: $scope.filterOptions
    };

  $scope.callModal = function(val){
     var modalInstance = $modal.open({
          templateUrl: 'myModalContent.html',
          controller: 'ModalInstanceCtrl',
          resolve: {
            items: function(){
              return val
            }
          } 
        });

        modalInstance.result.then(function () {
          $scope.gridOptions.selectAll(false);
          $log.info('Modal ok at: ' + new Date());
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        }); 
  };

  $scope.modify = function(){
     $scope.callModal({
                 type: 2,
                title: "修改",
                slinfo: $scope.mySelections[0]     
     })   
  };

  $scope.add = function(){
     $scope.callModal({
                 type: 1,
                title: "新增"
     })       
  };

  $scope.switchOn = function(){
      angular.forEach($scope.mySelections, function(rowItem) { 
        $scope.allData[$scope.allData.indexOf(rowItem)].status = true;
    });
      $scope.gridOptions.selectAll(false);
  };

  $scope.switchOff = function(){
      angular.forEach($scope.mySelections, function(rowItem) { 
        $scope.allData[$scope.allData.indexOf(rowItem)].status = false;
    });
      $scope.gridOptions.selectAll(false);
  };
});


app.controller('ModalInstanceCtrl',function($scope, $modalInstance, sharedProperties, items){
    console.log(items.type);
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
    $scope.ModalTitle = items.title;

    $scope.excAdd = function () {
      var data = sharedProperties.getData();
      data.unshift({name: $scope.name, age: $scope.age, birthday: $scope.birthday, salary: $scope.salary});
      $modalInstance.close();
    };

    $scope.excModify = function () {
      var data = sharedProperties.getData();
      var idx = data.indexOf(items.slinfo);
      data[idx] = {name: $scope.name, age: $scope.age, birthday: $scope.birthday, salary: $scope.salary};
      $modalInstance.close();
    };

    switch(items.type){
      case 1:
        $scope.ok = $scope.excAdd;
        break;
      case 2:
        $scope.name = items.slinfo.name;
        $scope.age = items.slinfo.age;
        $scope.birthday = items.slinfo.birthday;
        $scope.salary = items.slinfo.salary;
        $scope.ok = $scope.excModify;
        break;
    }
});