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
        swaywmMcp = pkgs.callPackage ./default.nix {
          inherit pkgs;
        };
      in
      {
        packages = {
          default = swaywmMcp;
          swaywm-mcp = swaywmMcp;
        };
        
        devShell = pkgs.mkShell {
          packages = with pkgs; [
            nodejs
            nodePackages.pnpm
            jq
            sway

            # AI stuff
            code-cursor

            # NOTE: uncomment to use swaywm-mcp 
            # swaywmMcp
          ];
        };
      }
    );
}
