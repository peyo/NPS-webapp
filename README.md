# NPS-webapp

Live app: https://peyo.github.io/NPS-webapp/

index2.js:
- What: Provides info of the park: Displays results of responseJson data in the DOM.
- How1: Takes inputed data from the DOM and adds to NPS endpoint to fetch data from NPS API.
- How2: Takes lat long data from NPS response and changes the syntax to be applicable to Google Geocode API parameters, then fetches response from Google Geocode API.
- How3: Takes response from Google Geocode API then concats all addresses in global array as 'merged'.
- How4: Takes merged addresses and adds them to the appropriate place in DOM.

Bugs:
- Addresses appear but incorrect addresses appear under the park.
- Addresses do not clear after new state is searched.

index.js:
- Everything found in index2, minus providing addresses to the park.
