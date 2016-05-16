var Card = React.createClass({

  getInitialState: function() {
    return {
      licence: {
        name: 'Mr Foo Bar Tron',
        photoUrl: 'img/photo.png',
        dateOfBirth: '01.01.1971',
        dateOfIssue: '02.02.1990',
        dateOfExpiry: '03.03.2030'
      },
      status: {
        doneLoading: false
      }
    }
  },

  componentDidMount: function() {
    console.log('licence data update request');
    $.ajax({
      url: 'api/data.json',
      dataType: 'json',
      cache: false,
      success: function(data) {
        console.log('licence data received from remote');
        this.setState({
          licence: data.licence,
          status: {
            doneLoading: true
          }
        });
        localStorage.licenceData = JSON.stringify(data);
        localStorage.cachedAt = moment().format('lll');
        console.log('licence data persisted to local storage');
      }.bind(this),
      error: function(xhr, status, err) {
        console.log('licence data could not be retrieved from remote');
        var licence = JSON.parse(localStorage.licenceData);
        if(licence != null) {
          this.setState( {licence: licence.licence} );
          console.log("licence data retrieved from local storage");
          myApp.addNotification({
            title: 'DVLA Digital Licence',
            subtitle: 'Cached Copy',
            message: 'Unable to connect to the network, using licence data cached ' + localStorage.cachedAt
          });
        }

        this.setState({ status:{doneLoading:true} });

        console.error(status, err.toString());
      }.bind(this)
    });
  },

  render: function() {
    if( this.state.status.doneLoading ) {
      return (
        <div id="passCard">
      <div id="passFront" className="pass">
        <div id="headerFields">
          <img src="images/logo.png" />
          <h1 >Driving Licence</h1>
          <div></div>
        </div>
        <div id="primaryFields" className="thumbnail">
          <img src={this.state.licence.photoUrl} />
          <div>
            <div className="passField">
            <span>{this.state.licence.name}</span></div>
          </div>
        </div>
        <div id="secondaryFields">
          <div>
            <div className="passField">
              <label>BIRTH DATE</label>
              <span>{this.state.licence.dateOfBirth}</span>
            </div>
            <div className="passField">
              <label>ISSUED</label>
              <span>{this.state.licence.dateOfIssue}</span>
            </div>
            <div className="passField">
              <label>EXPIRY</label>
              <span>{this.state.licence.dateOfExpiry}</span>
            </div>
          </div>
        </div>
        <div id="auxiliaryFields">
          <div>
            <div className="passField">
              <label>Address</label>
              <span>189 Orchard Gardens, London, W1A 1AA</span>
            </div>
          </div>
        </div>
        <div id="barcode">
          <div><img src="http://generator.barcodetools.com/barcode.png?gen=2&amp;data=eNortjIysVIy9HaJ9AlM8oxwdXQLKitLNIwI9TEOtLVVsgZcMJXrCRk%2C&amp;col=2&amp;row=0&amp;bcolor=FFFFFF&amp;fcolor=000000&amp;y2x=4.0&amp;xdim=2&amp;w=&amp;h=&amp;cmode=0&amp;ecl=9&amp;cpdf=0&amp;angle=0&amp;quiet=1&amp;alignh=1&amp;alignv=1" /></div>
        </div>
      </div>
    </div>
      );
    } else {
      return (
        <div className="component-wrapper">
          <div className="content-block center">
            <span className="preloader preloader-large"></span>
          </div>
        </div>
      );
    }
  }
});
