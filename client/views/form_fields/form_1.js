Template.form1.helpers({
  paperSizes: function() {
    return PaperSizes;
  }
});

Template.form1.events({
  'click .more-settings': function(event) {
    var show = $(event.currentTarget).text() === 'show more settings';
    if (show) {
      // hide
      $(event.currentTarget).text('hide more settings');
      $('.more-settings-fields').fadeIn();
    } else {
      // show
      $(event.currentTarget).text('show more settings');
      $('.more-settings-fields').fadeOut();
    }
    return false;
  }
});

Template.form1.onCreated(function() {
  this.autorun(function() {
     this.data.job = GetJob(this.data.jobId());
  }.bind(this));
});

Template.form1.onRendered(function() {
  var self = this;
  $('.more-settings-fields').hide();
  $('.ui.checkbox').checkbox();
  $('.ui.dropdown').dropdown();
  //
  // setupColorPicker();
  // var picker = new Pikaday({
  //   field: document.getElementById('datepicker'),
  //   format: 'MMM D YYYY',
  //   onSelect: function() {
  //     self.data.job.pickupDate = this.getMoment().toISOString();
  //   }
  // });

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
