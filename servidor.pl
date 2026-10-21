#!/usr/bin/perl
# Servidor local mínimo para a página de checagem.
# O player do YouTube só funciona servido por http://localhost (não por file://).
# Uso: perl servidor.pl [porta]
use strict;
use warnings;
use IO::Socket::INET;
use File::Basename qw(dirname);
use Cwd qw(abs_path);

my $port = shift || 8787;
my $root = dirname(abs_path(__FILE__));
my %types = (
  html => 'text/html; charset=utf-8',
  js   => 'text/javascript; charset=utf-8',
  css  => 'text/css; charset=utf-8',
  svg  => 'image/svg+xml',
  png  => 'image/png',
  json => 'application/json',
);

my $srv = IO::Socket::INET->new(
  LocalAddr => '127.0.0.1',
  LocalPort => $port,
  Listen    => 16,
  ReuseAddr => 1,
) or die "Não consegui abrir a porta $port: $!\n";

$| = 1;
print "Checagem ao vivo rodando em http://localhost:$port  (Ctrl+C para parar)\n";

while (my $c = $srv->accept) {
  my $req = <$c>;
  unless (defined $req) { close $c; next; }
  while (my $l = <$c>) { last if $l =~ /^\r?\n$/; }

  my ($path) = $req =~ m{^(?:GET|HEAD)\s+(\S+)};
  $path //= '/';
  $path =~ s/\?.*//;
  $path =~ s/%([0-9A-Fa-f]{2})/chr hex $1/ge;
  $path = '/index.html' if $path eq '/';

  my $file = "$root$path";
  if ($path =~ /\.\./ || !-f $file || $path =~ /\.pl$/) {
    print $c "HTTP/1.1 404 Not Found\r\nContent-Type: text/plain\r\nContent-Length: 9\r\nConnection: close\r\n\r\nnot found";
    close $c;
    next;
  }

  my ($ext) = $file =~ /\.([^.]+)$/;
  my $type = $types{lc($ext // '')} // 'application/octet-stream';
  open my $fh, '<:raw', $file or do { close $c; next; };
  local $/;
  my $body = <$fh>;
  close $fh;

  print $c "HTTP/1.1 200 OK\r\nContent-Type: $type\r\nContent-Length: " . length($body)
    . "\r\nCache-Control: no-store\r\nConnection: close\r\n\r\n";
  print $c $body unless $req =~ /^HEAD/;
  close $c;
}
