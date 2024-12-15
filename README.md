These are snoop.id services run as a seperate code. It is not the part of Next application. These run on server with a different port.

The reason behind these services are seperated is, we do not want to use a custom server.ts for Next app, and we need something to run constantly at backround. Cleanest way to do that is breaking app into multiservices.