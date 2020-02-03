module Vector2 where

import Prelude
import Data.Number.Format (toStringWith, fixed)

data Vector2 = Vector2 Number Number

showVec2 :: Vector2 -> String
showVec2 (Vector2 x y) = "(" <> 
           toStringWith (fixed 3) x <> 
           ", " <> 
           toStringWith (fixed 3) y <> ")"




addVec2 :: Vector2 -> Vector2 -> Vector2
addVec2 (Vector2 x1 y1) (Vector2 x2 y2) = 
    Vector2 (x1 + x2) (y1 + y2)



subVec2 :: Vector2 -> Vector2 -> Vector2
subVec2 (Vector2 x1 y1) (Vector2 x2 y2) =
    Vector2 (x1 - x2) (y1 - y2)

--infixr 5 addVec2 as +
--infixr 5 subVec2 as -