Template.form3D.helpers({
});

Template.form3D.events({

});

Template.form3D.onCreated(function() {
  this.autorun(function() {
     this.data.job = GetJob(this.data.jobId());
  }.bind(this));
});

Template.form3D.onRendered(function() {
  var self = this;

  setupColorPicker();
  var picker = new Pikaday({
    field: document.getElementById('datepicker'),
    format: 'MMM D YYYY',
    onSelect: function() {
      self.data.job.pickupDate = this.getMoment().toISOString();
    }
  });

});

/* TODO: Branch these out */
function setupColorPicker() {
  //https://bgrins.github.io/spectrum/#options-showPaletteOnly
  $("#colorpicker").spectrum({
    showPaletteOnly: true,
    showPalette: true,
    hideAfterPaletteSelect: true,
    color: 'dodgerBlue',
    palette: [
      ['dodgerBlue', 'darkred', 'green', 'gray', 'linen', 'orangeRed', 'white']
    ],
    change: function(color) {
      Session.set('3dColour', color.toHexString());
    }
  });
};
