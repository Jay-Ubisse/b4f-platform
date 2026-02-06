import { Attendance } from "@/components/attendance";
import { Calendar } from "@/components/calendar/indext";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CalendarPage() {
  return (
    <Tabs defaultValue="calendar" className="w-full">
      <TabsList>
        <TabsTrigger value="calendar">Calendário</TabsTrigger>
        <TabsTrigger value="attendance">Presenças</TabsTrigger>
      </TabsList>
      <TabsContent value="calendar">
        <Calendar />
      </TabsContent>
      <TabsContent value="attendance">
        <Attendance />
      </TabsContent>
    </Tabs>
  );
}
