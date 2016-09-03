To start :

1. Clone the project
2. Run ```npm install```
3. Run ```npm start```
4. Go to ```localhost:8080``` on your browser.

## Problems and learnings and stuff

My initial strategy was to convert geographic features into points (centroid-wise)
and disperse them such that they were at least distance R from any other point.

I did this by finding the point who 'overlapped' most frequently with other
points and then moving all its overlapping points away from it, repeating this
process until the whole thing dispersed enough. The idea was to try to preserve
angles between the features. This was partly successful.

I also tried moving all of the points away from the overlapped point, in an
effort to preserve the angles even more, but this dispersed too much and
I couldn't be bothered to write a packing algorithm to bring them all back
together again.

I have however gained a further understanding of the problem. You want to
optimise the algorithm for:

1. Putting features that are next to each-other IRL next to each-other in the viz.
   This is the main problem with this one: the features end up dispersed and
   sometimes counterintuitively placed.
2. Preserve angles between features where possible. This is what I attempted to
   do here and it's quite important — without preserving the angles your algo
   could easily just unwind your whole geography and figure out that the USA
   could be shaped in a more optimal way. Texas _needs_ to be jutting out of
   the bottom of the map, otherwise no one will recognise it.
3. Preserve something like the outline of the geographic area as a whole. This
   might be achieved by pt 2, or it might be adequate to forget pt. 2 and just
   preserve the outline in the assumption that the algo will figure out that
   Florida has to go where it does. Dubious though.

Dealing with competing concerns in algorithms is not something I'm good at. I
guess constraint optimisers are a pretty specialised and probably developed
area so perhaps that's where to look next.
