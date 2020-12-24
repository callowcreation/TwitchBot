import socialLinks from "./index";

const links = {
  facebook: "https://facebook.com",
  twitch: "https://twitch.tv/gbowne1"
};

test("Get Facebook link", () => {
  expect(socialLinks("facebook")).toStrictEqual({
    sendMessage: true,
    message: links.facebook
  });
});

test("Get Twitch link", () => {
  expect(socialLinks("twitch")).toStrictEqual({
    sendMessage: true,
    message: links.twitch
  });
});