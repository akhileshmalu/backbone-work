app = app || {};

app.collections.People = Backbone.Collection.extend({
	model: app.models.Person
});