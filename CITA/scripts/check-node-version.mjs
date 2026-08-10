const major = Number.parseInt(process.versions.node.split('.')[0], 10);

if (major !== 22) {
  console.error(
    `CITA builds must run on Node 22.x. Current runtime is Node ${process.versions.node}.\n` +
      'Install/use Node 22 before running `npm install` or `npm run build`.'
  );
  process.exit(1);
}
