app = app || {};

app.views.Person = Backbone.View.extend({
	tagName: 'li',
	
	attribute: function() {
		return {
			class:'person' + this.model.get('type')
		};
	},
	events: {
		'click .list-header': 'showDetails'

	},



	template: _.template($('#person-template').html()),

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},

	showDetails: function(e) {

		$(e.target).toggleClass('active');
		$(e.target).siblings('.details').slideToggle('fast');

	}
});

app.views.People = Backbone.View.extend({
	
	el: '#wrapper',

	initialize: function(data) {

		this.collection = new app.collections.People(data);
		
		this.setDataLength(this.collection.length);
		
		this.render();

		this.on("change:searchFilter", this.filterBySearch, this);

		this.collection.on("reset", this.render, this);
	},

	events: {
		'keyup #searchBox':'searchFilter'

	},

	render: function() {
		var self = this;
		$('#listing').empty();
		_.each(this.collection.models, function(person) {
			self.renderPerson(person);
		}, this);


	},

	setDataLength: function(l) {
		$('#count').html(l);
	},
	
	renderPerson: function(person) {
		var newperson = new app.views.Person({
			model: person
		});
		$('#listing').append(newperson.render().el);
	},

	searchFilter: function(e) {
		this.searchFilter = e.target.value;

		this.trigger('change:searchFilter');

	},

	filterBySearch: function() {
		this.collection.reset(directoryData, {silent: true});

		var filterString = this.searchFilter,
			filtered = _.filter(this.collection.models, function(item){
				return item.get('lastname').toLowerCase().indexOf(filterString.toLowerCase()) !== -1;
			});
		this.setDataLength(filtered.length);
		this.collection.reset(filtered);
	}


});
new app.views.People();