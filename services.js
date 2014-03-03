'use strict';

var app = angular.module('sevicesApp', []);

/**
 * service, value, factory may be watched as shorthands to provider
 */

// constant can be used in application config function
// can be used in application config: +
// can specify dependencies: -
app.constant('testConstant', function (context) {
	console.log('i am a test constant. context: ' + context);
});


// difference between value and constant that value can't be used in application config function
// can be used in application config: -
// can specify dependencies: -
app.value('testValue', function (context) {
	console.log('i am a test value. context: ' + context);
});


// function (in second parameter) return the service instance
// can be used in application config: -
// can specify dependencies: +
app.factory('testFactory', ['$log', function ($log) {
	return function (context) {
		$log.log('i am a test service from factory. context: ' + context);
	};
}]);


// the second parameter is a service constructor
// can be used in application config: -
// can specify dependencies: +
app.service('testService1', ['$log', function ($log) {
	this.log = function (context) {
		$log.log('i am just a test service(1). context: ' + context);
	};
}]);

// it's sophisticated for use dependencies here
var TestService = function ($log) {
	this.logger = $log;
	$log.log('where is the fucken constructor?');
}
TestService.prototype.log = function (context) {
	this.logger.log('i am just a test service(2). context: ' + context);
}
app.service('testService2', ['$log', TestService]);


// provider the most powerful way for define service. you can configure provider in application config function
// can be used in application config: +
// can specify dependencies: + (only in $get function)
app.provider('test', function () {
	var providerLabel = 'test';

	this.setProviderLabel = function (label) {
		providerLabel = label;
	};

	// use dependencies like this
	this.$get = ['$log', function ($log) {
		return function (context) {
			$log.log('i am just a test service from ' + providerLabel + ' provider. context: ' + context);
		}
	}];
});


app.config(['testConstant', 'testProvider', function (testConstant, testProvider) {
	testConstant('application config');

	// you can config provider here
	testProvider.setProviderLabel('funny');
}]);


app.controller('ParentCtrl', ['$scope', 'testConstant', 'testValue', 'testFactory', 'testService1', 'testService2', 'test', function ($scope, testConstant, testValue, testFactory, testService1, testService2, test) {
	testConstant('controller');
	testValue('controller');
	testFactory('controller');
	testService1.log('controller');
	testService2.log('controller');
	test('controller');
}]);