module Vector2 where

import Prelude
import Data.Number.Format (toStringWith, fixed)
import Math (sqrt, pow)
import Data.Int (toNumber)

data Vector2 = Vector2 Number Number

zeroVec2 :: Vector2
zeroVec2 = Vector2 0.0 0.0

oneVec2 :: Vector2
oneVec2 = Vector2 1.0 1.0

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
mag :: Vector2 -> Number
mag (Vector2 x y) = sqrt ((pow x 2.0) + (pow y 2.0))

dotVec2 :: Vector2 -> Vector2 -> Number
dotVec2 (Vector2 x1 y1) (Vector2 x2 y2) =
    x1 * x2 + y1 * y2

eqVec2 :: Vector2 -> Vector2 -> Boolean
eqVec2 (Vector2 x1 y1) (Vector2 x2 y2) =
    x1 == x2 && y1 == y2
