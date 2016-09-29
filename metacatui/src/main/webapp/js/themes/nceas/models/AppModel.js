﻿/*global define */
define(['jquery', 'underscore', 'backbone'], 				
	function($, _, Backbone) {
	'use strict';

	// Application Model
	// ------------------
	var AppModel = Backbone.Model.extend({
		// This model contains all of the attributes for the Application
		defaults: {
			headerType: 'default',
			title: MetacatUI.themeTitle || "Metacat Data Catalog",
			searchMode: 'map',
			sortOrder: 'dateUploaded+desc',
			previousPid: null,
			lastPid: null,
			anchorId: null,
			profileUsername: null,
			page: 0,
			profileQuery: null,
			baseUrl: "https://knb.ecoinformatics.org",
			// the most likely item to change is the Metacat deployment context
			context: '/metacat',
			d1Service: '/d1/mn/v1',
			d1CNBaseUrl: "https://cn-sandbox-2.test.dataone.org/",
			d1CNService: "cn/v1",
			viewServiceUrl: null,
			packageServiceUrl: null,
			publishServiceUrl: null,
			authServiceUrl: null,
			queryServiceUrl: null,
			metaServiceUrl: null,
			ldapwebServiceUrl: null,
			metacatServiceUrl: null,
			objectServiceUrl: null,
			bioportalSearchUrl: null,
			orcidSearchUrl: null,
			//tokenUrl: null,
			annotatorUrl: null,
			accountsUrl: null
		},
				
		defaultView: "share",
		
		initialize: function() {

			// these are pretty standard, but can be customized if needed
			this.set('viewServiceUrl', this.get('baseUrl') + this.get('context') + this.get('d1Service') + '/views/metacatui/');
			this.set('packageServiceUrl', this.get('baseUrl') + this.get('context') + this.get('d1Service') + '/package/');
			this.set('publishServiceUrl', this.get('baseUrl') + this.get('context') + this.get('d1Service') + '/publish/');
			this.set('authServiceUrl', this.get('baseUrl') + this.get('context') + this.get('d1Service') + '/isAuthorized/');
			this.set('queryServiceUrl', this.get('baseUrl') + this.get('context') + this.get('d1Service') + '/query/solr/');
			this.set('metaServiceUrl', this.get('baseUrl') + this.get('context') + this.get('d1Service') + '/meta/');
			this.set('objectServiceUrl', this.get('baseUrl') + this.get('context') + this.get('d1Service') + '/object/');
			this.set('ldapwebServiceUrl', this.get('baseUrl') + this.get('context') + '/cgi-bin/ldapweb.cgi');
			this.set('metacatServiceUrl', this.get('baseUrl') + this.get('context') + '/metacat');
			this.set("accountsUrl", this.get("d1CNBaseUrl") + this.get("d1CNService") + "/accounts/");
		
			this.on("change:pid", this.changePid);
		},
		
		changePid: function(model, name){			
			this.set("previousPid", model.previous("pid"));
		}
	});
	return AppModel;		
});
