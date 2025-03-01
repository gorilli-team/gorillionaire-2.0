import assert from "assert";
import { 
  TestHelpers,
  Chog_Approval
} from "generated";
const { MockDb, Chog } = TestHelpers;

describe("Chog contract Approval event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for Chog contract Approval event
  const event = Chog.Approval.createMockEvent({/* It mocks event fields with default values. You can overwrite them if you need */});

  it("Chog_Approval is created correctly", async () => {
    // Processing the event
    const mockDbUpdated = await Chog.Approval.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    let actualChogApproval = mockDbUpdated.entities.Chog_Approval.get(
      `${event.chainId}_${event.block.number}_${event.logIndex}`
    );

    // Creating the expected entity
    const expectedChogApproval: Chog_Approval = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      owner: event.params.owner,
      spender: event.params.spender,
      value: event.params.value,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualChogApproval, expectedChogApproval, "Actual ChogApproval should be the same as the expectedChogApproval");
  });
});
