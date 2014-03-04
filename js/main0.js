// main.js


'use strict';

var app = angular.module('myApp', ['ngGrid','ui.bootstrap']);


app.controller('AlertDemoCtrl', function($scope){
  $scope.Alerts = [];


})

app.controller('MyCtrl1', function($scope, $http) {
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
            var data;
            if (searchText) {
                var ft = searchText.toLowerCase();
                $http.get('jsonFiles/largeLoad.json').success(function (largeLoad) {    
                    data = largeLoad.filter(function(item) {
                        return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                    });
                    $scope.setPagingData(data,page,pageSize);
                });            
            } else {
                $http.get('jsonFiles/largeLoad.json').success(function (largeLoad) {
                    $scope.setPagingData(largeLoad,page,pageSize);
                });
            }
        }, 100);
    };
  
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
  
    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
    $scope.$watch('filterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
  
    $scope.gridOptions = {
        data: 'myData',
        enablePaging: true,
        showFooter: true,
        showFilter:true,
        totalServerItems: 'totalServerItems',
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions
    };
});

// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------


app.controller("MyCtrl4",function($scope, $timeout, $http){
 
  $scope.mySelections = [];
  $http.get('jsonFiles/staffList.json').success(function(data) {
   $scope.myData = data;
  });

  $scope.gridOptions = {
    data: 'myData',
    enableCellSelection: true,
    enablePaging: true,
    selectedItems : $scope.mySelections,
    showSelectionCheckbox : true,
    selectWithCheckboxOnly: true,
    showFilter: true,
    enableCellEdit: true,
    showFooter: true,
    showColumnMenu: true,
    columnDefs: [{ field: "name", enableCellEdit: false},
                    { field: "age", cellFilter: 'number'},
                    { field: "birthday", cellFilter: 'date'},
                    { field: "salary", cellFilter: 'currency'}],
    pagingOptions: {
                    pageSizes: [5, 10],
                    pageSize: 5,
                    currentPage: 1
                },
    // filterOptions: filterOptions.filterText
  };

  $scope.total_salary = function(){
    var total_s = 0;
    for(var i=0;i<$scope.myData.length;i++){
      total_s += parseInt($scope.myData[i].salary);
    }
    return total_s
  };

  $scope.deleteSelected = function() {
    angular.forEach($scope.mySelections, function(rowItem) { 
        $scope.myData.splice($scope.myData.indexOf(rowItem),1);
      });
    $scope.addAlert({type: 'danger', msg: "成功删除"+$scope.mySelections.length+"项"});
    $scope.mySelections = [];
  };

  $scope.addPerson = function(){
    $scope.myData.unshift({name: $scope.name, age: $scope.age, birthday: $scope.birthday, salary: $scope.salary});
    $scope.addAlert({type: 'success', msg: "成功添加职员："+$scope.name})
  };

  $scope.clearInput = function(){
    $scope.name = null;
    $scope.age = null;
    $scope.title = null;
  };

  $scope.save = function(){
    // $http.post('jsonFiles/register.json', $scope.myData)
    $scope.addAlert({type: 'success', msg: "------$http.post('jsonFiles/register.json', $scope.myData)-----------保存成功"})
  };

  $scope.alerts = [];

  $scope.addAlert = function(msg) {
    $scope.alerts.push(msg);
    $timeout($scope.closeAlert,2000)
  };

  $scope.closeAlert = function(index) {
    index = index || 0 ; 
    $scope.alerts.splice(index, 1);
  }; 

});
