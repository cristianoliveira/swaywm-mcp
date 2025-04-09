{ pkgs ? import <nixpkgs> {} }:

pkgs.buildNpmPackage {
  pname = "swaywm-mcp";
  version = "0.0.1";
  
  src = ./.;
  
  npmDepsHash = "";
  
  nativeBuildInputs = [
    pkgs.nodejs
  ];

  installPhase = ''
    mkdir -p $out/bin
    cp -r dist/* $out/bin/
    chmod +x $out/bin/main.js
    ln -s $out/bin/main.js $out/bin/swaywm-mcp
  '';
  
  makeWrapperArgs = ["--prefix PATH : ${pkgs.lib.makeBinPath [pkgs.jq]}"];
  
  meta = with pkgs.lib; {
    description = "Swaywm MCP service";
    homepage = "https://github.com/cristianoliveira/swaywm-mcp";
    license = licenses.mit;
    platforms = platforms.unix;
    maintainers = with maintainers; [ cristianoliveira ];
  };
} 
