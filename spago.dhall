{-
Welcome to a Spago project!
You can edit this file as you like.
-}
{ name = "my-project"
, dependencies =
    [ "assert"
    , "console"
    , "effect"
    , "integers"
    , "numbers"
    , "psci-support"
    , "quickcheck"
    ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs", "test/**/*.purs" ]
}
