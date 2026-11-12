# Contributing

Thank you for helping. Every masjid that uses this board makes it better for the next one.

## Easy ways to help (no coding needed)

### Add a language
1. Copy `i18n/en.json` to a new file named with the language code, for example `i18n/fr.json`, `i18n/tr.json` or `i18n/bn.json`.
2. Translate the values on the right. Keep the keys on the left exactly as they are.
3. Set `"dir"` to `"rtl"` for right-to-left scripts (Arabic, Urdu, Persian), otherwise `"ltr"`.
4. Set `"locale"` to the language code. It controls how dates and numbers are written.
5. Check it by opening the board with `?lang=fr` on the end of the address.
6. Open a pull request. Please say in it whether you are a native speaker.

### Add a theme
1. Copy `themes/teal.css` to `themes/<your-theme>.css`.
2. Change the colours. Keep the text readable from the back of a prayer hall: aim for at least 7:1 contrast between `--ink` and the background.
3. Check it with `?theme=<your-theme>`.
4. Open a pull request with a screenshot.

### Report a problem
Open an issue with your city, calculation method, the time the board shows and the time it should show.

## Code changes

There is no build step. Edit the files and refresh the browser.

- `src/engine.js` holds the schedule logic (adhan, iqamah, Jumu'ah, rollover). It has no DOM code so it can be tested in Node.
- `src/board.js` draws the screen.
- `board.css` is layout only. Colours belong in `themes/`.

Run the tests with Node 20 or newer:

```
npm test
```

Please add a test in `test/engine.test.js` for any change to `src/engine.js`.

## Pull request checklist
- One change per pull request
- Tests pass (`npm test`)
- A screenshot if you changed anything you can see
- No new dependencies unless we have discussed them in an issue first

## Behaviour
Be kind and patient. Many people here are volunteers helping their local masjid in their spare time.
