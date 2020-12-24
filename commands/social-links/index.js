export default social => {
    const links = {
      facebook: "https://facebook.com",
      twitch: "https://twitch.tv/gbowne1"
    };
  
    switch (social) {
      case "facebook":
        return { sendMessage: true, message: links.facebook };
      case "twitch":
        return { sendMessage: true, message: links.twitch };
      default:
        break;
    }
  };