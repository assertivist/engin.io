module Rect where

import Prelude
import Vector2

data Rect = Rect Vector2 Vector2

showRect :: Rect -> String
showRect (Rect vmin vmax) = 
    "Rect[" <> showVec2 vmin <> "->" <> showVec2 vmax <> "]"

--width :: Rect -> Number
--width (Rect min max) = max.x - min.x

--height :: Rect -> Number
--height (Rect min max) = max.y - min.y

--center :: Rect -> Vector2
--center rect = 