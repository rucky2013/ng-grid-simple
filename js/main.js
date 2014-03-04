// main.js


'use strict';

var app = angular.module('myApp', ['ngGrid','ui.bootstrap']);


app.controller("MyCtrl4",function($scope, $timeout, $http){
 
  $scope.mySelections = [];
  $scope.myData = [];
  $scope.total_salary = function(){
    var total_s = 0,data=$scope.myData;
    for(var i=0;i<data.length;i++){
      total_s += parseInt(data[i].salary);
    }
    return total_s
  };
  
  $scope.deleteSelected = function() {
    angular.forEach($scope.mySelections, function(rowItem) { 
        $scope.myData.splice($scope.myData.indexOf(rowItem),1);
      });
    $scope.addAlert({type: 'danger', msg: "成功删除"+$scope.mySelections.length+"项"});
    // $scope.mySelections = [];
    $scope.gridOptions.selectAll(false);
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
    $http.post('jsonFiles/register.json', $scope.myData);
    $scope.addAlert({type: 'success', msg: "保存成功"})
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
            var data;
            if (searchText) {
                var ft = searchText.toLowerCase();
                $http.get('jsonFiles/staffList.json').success(function (staffList) {    
                    data = staffList.filter(function(item) {
                        return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                    });
                    $scope.setPagingData(data,page,pageSize);
                });            
            } else {
                $http.get('jsonFiles/staffList.json').success(function (staffList) {
                    $scope.setPagingData(staffList,page,pageSize);
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
                      { field: "age", cellFilter: 'number'},
                      { field: "birthday", cellFilter: 'date'},
                      { field: "salary", cellFilter: 'currency'}],
      totalServerItems: 'totalServerItems',
      pagingOptions: $scope.pagingOptions,
      filterOptions: $scope.filterOptions
    };
/*
    $scope.Val = "topval";
    $scope.ModalCtrl = function($scope,$modal,$log){

      $scope.items = ['item1', 'item2', 'item3'];

      $scope.open = function () {

        var modalInstance = $modal.open({
          templateUrl: 'myModalContent.html',
          controller: $scope.ModalInstanceCtrl,
          resolve: {
            items: function () {
              return $scope.items;
            }
          }
        });

        modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };

    };
    $scope.ModalInstanceCtrl = function($scope, $modalInstance, items){
        $scope.items = items;
        $scope.selected = {
          item: $scope.items[0]
        };

        $scope.ok = function () {
          allData.unshift({name: $scope.name, age: $scope.age, birthday: $scope.birthday, salary: $scope.salary});
          // allData.addAlert({type: 'success', msg: "成功添加职员："+$scope.name})
          $modalInstance.close($scope.selected.item);
          console.log($scope.name);
        };

        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
        };
    }*/


});

app.controller('ModalCtrl', function($scope,$modal,$log){
  $scope.Val = "subval";
  $scope.items = ['item1', 'item2', 'item3'];

  $scope.open = function () {

    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

});

app.controller('ModalInstanceCtrl',function($scope, $modalInstance, items){
  $scope.items = items;
    $scope.selected = {
      item: $scope.items[0]
    };

    $scope.ok = function () {
      $parent.myData.unshift({name: $scope.name, age: $scope.age, birthday: $scope.birthday, salary: $scope.salary});
      $parent.addAlert({type: 'success', msg: "成功添加职员："+$scope.name})
      $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
});