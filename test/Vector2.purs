module Test.Vector2 where

import Prelude
import Vector2 (Vector2(..), addVec2, eqVec2)
import Effect (Effect)
import Effect.Class.Console (log)
import Test.Assert (assert')

main :: Effect Unit
main = 
    do
        log "asdf"
        assert' "hello" false--((i `addVec2` i) `eqVec2` o)
