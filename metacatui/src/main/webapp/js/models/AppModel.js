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
			
			emailContact: "knb-help@nceas.ucsb.edu",
			
			googleAnalyticsKey: null,
			
			nodeId: null,

			searchMode: MetacatUI.mapKey ? 'map' : 'list',
			searchHistory: [],
			sortOrder: 'dateUploaded+desc',
			page: 0,
			
			previousPid: null,
			lastPid: null,
			
			anchorId: null,
			
			userProfiles: true,
			profileUsername: null,
			
			useJsonp: true,
			
			maxDownloadSize: 3000000000,
			
			metacatVersion: "2.7.2", 
			baseUrl: window.location.origin || (window.location.protocol + "//" + window.location.host),
			// the most likely item to change is the Metacat deployment context
			context: '/metacat',
			d1Service: '/d1/mn/v2',
			d1CNBaseUrl: "https://cn.dataone.org/",
			d1CNService: "cn/v2",
			d1LogServiceUrl: null,
			nodeServiceUrl: null,
			viewServiceUrl: null,
			packageServiceUrl: null,
			publishServiceUrl: null,
			authServiceUrl: null,
			queryServiceUrl: null,
			metaServiceUrl: null,
			ldapwebServiceUrl: null,
			metacatBaseUrl: null,
			metacatServiceUrl: null,
			objectServiceUrl: null,
			//grantsUrl: null,
			//bioportalSearchUrl: null,
			//orcidSearchUrl: null,
			//orcidBioUrl: null,
			//tokenUrl: null,
			//checkTokenUrl: null,
			//annotatorUrl: null,
			accountsUrl: null,
			//pendingMapsUrl: null,
			//accountsMapsUrl: null,
			groupsUrl: null,
			prov: true,
			useSeriesId: true
		},
				
		defaultView: "data",
		
		initialize: function() {
			
			//If no base URL is specified, then use the DataONE CN base URL
			if(!this.get("baseUrl")){
				this.set("baseUrl",   this.get("d1CNBaseUrl"));
				this.set("d1Service", this.get("d1CNService"));
			}
			
			// these are pretty standard, but can be customized if needed
			this.set('metacatBaseUrl', this.get('baseUrl') + this.get('context'));
			this.set('viewServiceUrl', this.get('baseUrl') + this.get('context') + this.get('d1Service') + '/views/metacatui/');
			this.set('publishServiceUrl', this.get('baseUrl') + this.get('context') + this.get('d1Service') + '/publish/');
			this.set('authServiceUrl', this.get('baseUrl') + this.get('context') + this.get('d1Service') + '/isAuthorized/');
			this.set('queryServiceUrl', this.get('baseUrl') + this.get('context') + this.get('d1Service') + '/query/solr/');
			this.set('metaServiceUrl', this.get('baseUrl') + this.get('context') + this.get('d1Service') + '/meta/');
			this.set('objectServiceUrl', this.get('baseUrl') + this.get('context') + this.get('d1Service') + '/object/');
			this.set('metacatServiceUrl', this.get('baseUrl') + this.get('context') + '/metacat');
			
			//Add a ? character to the end of the Solr queries when we are appending JSONP parameters (which use ?'s)
			if(this.get("useJsonp"))
				this.set("queryServiceUrl", this.get("queryServiceUrl") + "?");		
			
			if(typeof this.get("grantsUrl") !== "undefined")
				this.set("grantsUrl", this.get("baseUrl") + "/api.nsf.gov/services/v1/awards.json");
			
			//DataONE CN API 
			if(this.get("d1CNBaseUrl")){
				
				//Account services 
				if(typeof this.get("accountsUrl") != "undefined"){
					this.set("accountsUrl", this.get("d1CNBaseUrl") + this.get("d1CNService") + "/accounts/");
					
					if(typeof this.get("pendingMapsUrl") != "undefined")
						this.set("pendingMapsUrl", this.get("accountsUrl") + "pendingmap/");
					
					if(typeof this.get("accountsMapsUrl") != "undefined")
						this.set("accountsMapsUrl", this.get("accountsUrl") + "map/");

					if(typeof this.get("groupsUrl") != "undefined")
						this.set("groupsUrl", this.get("d1CNBaseUrl") + this.get("d1CNService") + "/groups/");
				}
				
				if(typeof this.get("d1LogServiceUrl") != "undefined")
					this.set('d1LogServiceUrl', this.get('d1CNBaseUrl') + this.get('d1CNService') + '/query/logsolr/');
				
				if(this.get("useJsonp") && (typeof this.get("d1LogServiceUrl") != "undefined"))
					this.set('d1LogServiceUrl', this.get("d1LogServiceUrl") + "?");

				this.set("nodeServiceUrl", this.get("d1CNBaseUrl") + this.get("d1CNService") + "/node/");
				this.set('resolveServiceUrl', this.get('d1CNBaseUrl') + this.get('d1CNService') + '/resolve/');
		
				//Settings for the DataONE API v2 only
				if(this.get("d1CNService").indexOf("v2") > -1){
					
					//Token URLs
					if(typeof this.get("tokenUrl") != "undefined"){
						this.set("tokenUrl", this.get("d1CNBaseUrl") + "/portal/token");
						this.set("checkTokenUrl", this.get("d1CNBaseUrl") + this.get("d1CNService") + "/diag/subject");
					}
					
					//ORCID search
					if(typeof this.get("orcidBaseUrl") != "undefined")
						this.set('orcidSearchUrl', this.get('orcidBaseUrl') + '/search/orcid-bio?q=');
					
					//Turn the provenance features on
					if(typeof this.get("prov") != "undefined")
						this.set("prov", true);
					
					//Turn the seriesId feature on					
					if(typeof this.get("useSeriesId") != "undefined")
						this.set("useSeriesId", true);
				}
				else{
					//Turn the provenance features off
					if(typeof this.get("prov") != "undefined")
						this.set("prov", false);
					//Turn the seriesId feature off
					if(typeof this.get("useSeriesId") != "undefined")
						this.set("useSeriesId", false);
				}
			}
			
			//Settings for older versions of metacat, using DataONE API v1
			if((this.get("metacatVersion") < "2.5.0") && (this.get("d1Service").toLowerCase().indexOf("mn/v1") > -1)){
				//The package service API is different
				this.set('packageServiceUrl', this.get('baseUrl') + this.get('context') + this.get('d1Service') + '/package/');
			}
			//Whenever the Metacat version is at least 2.5.0 and we are querying a MN
			else if((this.get("metacatVersion") >= "2.5.0") && (this.get("d1Service").toLowerCase().indexOf("mn/") > -1)){
				//The package service for v2 DataONE API
				this.set('packageServiceUrl', this.get('baseUrl') + this.get('context') + this.get('d1Service') + '/packages/application%2Fbagit-097/');
				
				if(typeof this.get("useSeriesId") != "undefined")
					this.set("useSeriesId", true);
			}				
	
			this.on("change:pid", this.changePid);
		},

		changePid: function(model, name){			
			this.set("previousPid", model.previous("pid"));
		}
	});
	return AppModel;		
});
