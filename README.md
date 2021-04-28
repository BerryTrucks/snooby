# Snooby

Snooby is a Blackberry 10 Reddit client developed by Amos Chan. Currently, Snooby is allows you to vote, comment and check your mail.

## Development

The BerryTrucks version of Snooby has been ported to WebWorks 2.

To build:

1. Install the [WebWorks 2 SDK](https://developer.blackberry.com/html5/download)
2. Create a new project in WebWorks
3. Replace `config.xml` and the `www` directory with the contents of this repository (or symlink them in)
4. Add the cordova plugins as per `config.xml`:

```
cd projectDir
webworks plugin add com.blackberry.app
(etc.)
```

## See also
* Original [repository](http://github.com/achan/snooby)
- [App World](http://appworld.blackberry.com/webstore/content/23060906/)
- [Snooby subreddit](http://reddit.com/r/snoobyapp)
