# Client photographs

Files here are the faces shown beside "500+ happy clients" in the
"How this actually runs" section (`components/ImpactStage.tsx`).

**Real client photographs only, with their permission.**

Slots with no photo render a drawn figure (`AvatarArt` in `ImpactStage.tsx`)
rather than a photograph of a stranger — a drawing reads as a stand-in, while a
real face beside a client count reads as a claim that this person is a client.
The review carousel makes the same call for the same reason; see the note at
`components/ReviewCarousel.tsx:36`.

A real photo added here always takes priority over the drawing in that slot, so
shipping with one, two or no photos is all fine.

## Adding one

1. Drop the file here, e.g. `client-1.webp`. A square crop around the face
   works best — it is rendered into a 2.1rem circle.
2. Add it to `CLIENT_AVATARS` in `components/ImpactStage.tsx`:

   ```ts
   const CLIENT_AVATARS: { src: string; alt: string }[] = [
     { src: "/clients/client-1.webp", alt: "" },
   ];
   ```

`alt` stays empty because the row is decorative — the claim itself is already
in the text beside it, and the wrapper is `aria-hidden`.
