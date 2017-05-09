/* global Promise, window */
import React from 'react';
import PropTypes from 'prop-types';
import { VideoBox } from 'common/components';
import { propChecker } from 'helpers';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      windowWidth: window.innerWidth
    };
  }

  componentDidMount() {
    let dataNeeded = [];

    let ms = 24 * 3600 * 1000;
    let { trending } = this.props;
    if (Date.now() - trending.date > ms || !trending.videos) {
      dataNeeded.push(this.props.fetchTrending());
    }

    let channelIds = [
      'UC-9-kyTW8ZkZNDHQJ6FgpwQ',
      'UCEgdi0XIXXZ-qJOFPf4JSKw',
      'UCOpNcN46UbXVtpKMrmU4Abg',
      'UClgRkhTL3_hImCAmdLfDE4g',
      'UCYfdidRxbB8Qhf0Nx7ioOYw',
      'UCBR8-60-B28hp2BmDPdntcQ'
    ];

    for (let i = 0; i < channelIds.length; i++) {
      const id = channelIds[i];
      dataNeeded.push(this.props.fetchChannelVideos(id));
    }

    if (this.props.loggedIn) {
      dataNeeded.push(this.props.fetchRecommendedVideos());
    }

    Promise.all(dataNeeded).then(() => this.props.receiveSetting({ isLoading: false }));
  }

  componentWillReceiveProps(newProps) {
    if (!this.props.loggedIn && newProps.loggedIn) {
      newProps.fetchRecommendedVideos();
    }
  }

  renderChannels() {
    let channels = this.props.homeChannels;

    let ids = Object.keys(channels);
    if (ids[0]) {
      return ids.map(id => {
        let channel = channels[id];
        let title = channel.videos[0].snippet.channelTitle;
        return (
          <VideoBox
            key={id}
            title={title}
            sidebarVisible={this.props.setting.sidebarVisible}
            windowWidth={this.props.setting.windowWidth}
            vids={channel.videos}
          />
        );
      });
    }
  }

  renderRecommended() {
    if (this.props.loggedIn && this.props.recommended.videos) {
      return (
        <VideoBox
          title='Recommended'
          sidebarVisible={this.props.setting.sidebarVisible}
          multiline
          vids={this.props.recommended.videos || []}
          windowWidth={this.props.setting.windowWidth}
        />
      );
    }
  }

  render() {
    const { isLoading } = this.props.setting;
    const { videos } = this.props.trending;

    if (!isLoading) {
      return (
        <div className='main-content'>
          {this.renderRecommended()}
          <VideoBox
            title='Trending'
            sidebarVisible={this.props.setting.sidebarVisible}
            windowWidth={this.props.setting.windowWidth}
            vids={videos}
          />
          {this.renderChannels()}
        </div>
      );
    }

    return (
      <div className='home-page' />
    );
  }
}

Home.propTypes = {
  fetchTrending: PropTypes.func.isRequired,
  fetchChannelVideos: PropTypes.func.isRequired,
  fetchRecommendedVideos: PropTypes.func.isRequired,
  receiveSetting: PropTypes.func.isRequired,
  homeChannels: propChecker.homeChannels().isRequired,
  loggedIn: PropTypes.bool.isRequired,
  recommended: propChecker.recommended().isRequired,
  trending: propChecker.trending().isRequired,
  setting: propChecker.setting().isRequired
};

export default Home;
