module Test.Main where

import Prelude
import Vector2 (Vector2(..), addVec2, eqVec2, mag, oneVec2)
import Effect (Effect)
import Effect.Class.Console (log)
import Test.QuickCheck (quickCheck)

main :: Effect Unit
main = 
    do
        log "Checking Vector2 add..."
        quickCheck ((oneVec2 `addVec2` oneVec2) `eqVec2` twoVec2)
        log "Checking Vector2 mag..."
        quickCheck ((mag oneVec2) == 1.4142135623730951)
    where
        twoVec2 = Vector2 2.0 2.0
