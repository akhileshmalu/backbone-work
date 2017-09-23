// var ListContainerView = SOCIView.extend({
// 	template: _.template($('#ListContainerView').text()),
// 	className: 'ListContainerView'
// });
app = app || {};

app.views.ListItem = Backbone.View.extend({
	tagName: 'li',
	
	events: {
		'click .list-header': 'showDetails',
		'click .list-header span': 'overrideChildEvent',
		'click .delBtn': 'deleteItem',
		
	},


	template: _.template($('#ListContainerView').html()),

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},

	// function to provide accordian details
	showDetails: function(e) {

		$(e.target).toggleClass('active');
		$(e.target).siblings('.details').slideToggle('fast').css("display","inline-grid").css("width","100%");

	},

	//inner span element toggle class override
	overrideChildEvent: function(e) {

		
		$(e.delegateTarget.firstElementChild).toggleClass('active');
		$(e.delegateTarget.firstElementChild).siblings('.details').slideToggle('fast').css("display","inline-grid").css("width","100%");
		
	},
	
	// delete Item 
	deleteItem : function() {
		this.model.destroy(self.model);
	}
});

app.views.ListContainerView = Backbone.View.extend({
	
	el: '#wrapper',

	initialize: function(data) {

		// this.collection = new app.collections.ListItemCollection(data);
		this.collection = new app.collections.ListItemCollection();
		
		this.setSummaryData(this.collection);
		
		this.render();

		this.on("change:searchFilter", this.filterBySearch, this);

		this.on("change:sortControl", this.sortByCriteria, this);

		this.collection.on('remove', this.render, this);

		this.collection.on("reset", this.render, this);
	},

	events: {
		'keyup #searchBox':'searchFilter',
		'click .sortable': 'sortControl',
		
		// By passing del button show events to avoid conflict of details hover
		'mouseenter li': 'delButtonShow',
		'mouseleave li': 'delButtonHide'
	},

	render: function() {
		var self = this;
		$('#listing').empty();
		_.each(this.collection.models, function(item) {
			self.renderItem(item);
		}, this);
	},



	// standard summary data filling on view
	setSummaryData: function(l) {

		$('#count').html(l.length);

		// calculate length of approved posts
		$('#apprvCount').html(
			_.filter(l.models, function(item){
				return (item.get('customer_approved') == '1' && item.get('manager_approved') == '1');
			}).length);
		


		//calculate length of pending post
		$('#pendingCount').html(
			_.filter(l.models, function(item){
				return (item.get('customer_approved') == '0' || item.get('manager_approved') == '0');
			})
			.length);

		//calculate length of rejected post
		$('#rejectCount').html(
			_.filter(l.models, function(item){
				return (item.get('customer_approved') == '-1' || item.get('manager_approved') == '-1');
			})
			.length);

	},
	
	renderItem: function(item) {
		var newitem = new app.views.ListItem({
			model: item
		});
		$('#listing').append(newitem.render().el);
	},

	// event acceptance and trigger
	searchFilter: function(e) {
		this.searchFilter = e.target.value;
		this.trigger('change:searchFilter');

	},


	// filter method : currently filter data per messge and customer name only.
	filterBySearch: function() {
		this.collection.reset(this.collection.TESTDATA.posts, {silent: true});

		var filterString = this.searchFilter,
			filtered = _.filter(this.collection.models, function(item){
				return (item.get('message').toLowerCase().indexOf(filterString.toLowerCase()) !== -1)
				|| (item.get('created_by_name').toLowerCase().indexOf(filterString.toLowerCase()) !== -1);
			});

		this.setSummaryData(new app.collections.ListItemCollection(filtered));
		this.collection.reset(filtered);
	},

	sortControl: function(e) {
		
		this.sortControl = e.target.value;
		this.trigger('change:sortControl');		

	},

	sortByCriteria: function() {

		var self = this;
		this.collection.reset(this.collection.TESTDATA.posts, {silent: true});
		
		filtered = _.sortBy(this.collection.models, function(a){
			return a.get(self.sortControl);
		});
		
		this.collection.reset(filtered);

	},

	delButtonShow: function(e) {
		$(e.currentTarget.children[0].children[4]).css("display","inline-block");
	},

	delButtonHide: function(e) {
		$(e.currentTarget.children[0].children[4]).css("display","none");
	}

});