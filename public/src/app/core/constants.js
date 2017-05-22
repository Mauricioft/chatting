/* global toastr:false, moment:false */
(function() {
    'use strict';
    angular
      .module('app')
	    .constant('CONSTANTS',{
		    'APP_VERSION': '0.0.1',
		    'BASE_URL': 'http://1123club.com',
		    'BASE_URL_SOCKET': 'http://' + window.location.host,
		    'API_BASE_URL': 'http://1123club.com/api/v1',
		    'PATTERNS': {
	        'IDENTIFIER': /^[0-9]{12}$/,
	        'EMAIL': /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i,
	        'USERNAME': /^[a-zA-Z0-9]{5,20}$/,
	        'ALPHANUMERIC': /^[a-zA-ZñÑ\s\W0-9]+$/,
	        'NUMERIC': /[0-9]+(\.[0-9][0-9]?)?/,
	        'CHARACTER': /[a-zA-Z]/
		    },
		    'ROLES': {
		      'ADMIN': 'admin',
		    }
			});
})();