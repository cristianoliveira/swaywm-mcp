{
  description = "Swaywm mcp service";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { 
          inherit system;
          config = {
            allowUnfree = true;
          };
        };
      in
      {
        devShell = pkgs.mkShell {
          packages = with pkgs; [
            nodejs
            nodePackages.pnpm
            jq
            sway

            # AI stuff
            code-cursor
          ];
        };
      }
    );
}
