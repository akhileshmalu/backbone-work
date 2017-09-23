app = app || {};

app.models.ListItemModel = Backbone.Model.extend({
	default:{  
      "id":"",
      "schedule":"",
      "utc_offset":"",
      "project_id":"",
      "network":"",
      "network_name":"",
      "network_thumb":"",
      "message":"",
      "data":[
      	{"image_added":""},
         {"pictures":[""] },
         {"picture":""},
         {"link":""},
         {"name":""},
         {"caption":""},
         {"description":""},
         {"domain":""},
         {"type":""}
      ],
      "customer_approved":"",
      "manager_approved":"",
      "rejection_message":"",
      "created_at":"",
      "created_by":"",
      "created_by_id":"",
      "created_by_name":""
   },

   dateFormatModify: function(str) {
      return str.substr(0, 7) + str.substr(4,1)+str.substr(7);
   },

   initialize: function() {

            this.set("titleMsg",this.get('message').substr(0,60));

            // approval definitions
            var actionApr = parseInt(this.get('customer_approved')) + parseInt(this.get('customer_approved'));
            var appvStatus = (actionApr == 2)? "Approved": (actionApr == 1 || actionApr == 0)? "Pending" : "Rejected";
            this.set("approvalStatus",appvStatus);

            // date format modification  (YYYY-MMDD HH:MM:SS) => (YYYY-MM-DD HH:MM:SS) to make momentjs valid date
            var self = this;

            this.set("schedule",self.dateFormatModify(this.get('schedule')));
            this.set("created_at",self.dateFormatModify(this.get('created_at')));
            
      }
});